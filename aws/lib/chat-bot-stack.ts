import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import { Credentials } from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ChatBotStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // VPC:
        // Create a new VPC with public and private subnets
        const vpc = new ec2.Vpc(this, `VPC`, {
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'public-subnet',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'private-subnet-with-egress',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                },
            ],
        });

        // Select the private subnets
        const privateSubnets = vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS });

        // Database:
        // Data base username and password are set in .env file.
        // probably better set in secrets manager!
        const databaseUser = process.env.DATABASE_USER ?? '';
        const databasePassword = process.env.DATABASE_PASSWORD ?? '';
        const databaseName = process.env.DATABASE_NAME ?? '';
        const databaseCredentials = Credentials.fromPassword(
            databaseUser,
            cdk.SecretValue.unsafePlainText(databasePassword),
        );

        const postgres = new rds.DatabaseInstance(this, `Database`, {
            engine: rds.DatabaseInstanceEngine.POSTGRES,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
            credentials: databaseCredentials,
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            databaseName: databaseName,
        });
        postgres.connections.allowFromAnyIpv4(ec2.Port.tcp(5432));

        // Redis:
        // Elastic cache Cluster with a single node.
        // we may want bigger?!
        // requires:
        // - security group
        // - subnet group
        // - cache cluster
        const redisSecurityGroup = new ec2.SecurityGroup(this, `RedisSecurityGroup`, {
            vpc,
            description: 'Security group for Redis instance',
            allowAllOutbound: true,
        });
        redisSecurityGroup.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(6379));

        const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, `RedisSubnetGroup`, {
            description: 'Subnet group for Redis instance',
            subnetIds: privateSubnets.subnetIds,
        });
        const redis = new elasticache.CfnCacheCluster(this, `RedisCluster`, {
            cacheNodeType: 'cache.t2.micro',
            engine: 'redis',
            numCacheNodes: 1,
            vpcSecurityGroupIds: [redisSecurityGroup.securityGroupId],
            cacheSubnetGroupName: redisSubnetGroup.ref,
        });

        // VPC Connector:
        const appRunnerVpcConnector = new cdk.aws_apprunner.CfnVpcConnector(this, `VPCConnector`, {
            subnets: privateSubnets.subnetIds,
            securityGroups: [
                redisSecurityGroup.securityGroupId,
                postgres.connections.securityGroups[0].securityGroupId,
            ],
            vpcConnectorName: `${id}-VPCConnector`,
        });

        // App Runner:
        // App Runner service with a single instance.
        // pulls the image from ECR.
        // requires:
        // - service role
        // - instance role
        // - service
        const appRunnerServiceRole = new iam.Role(this, `AppRunnerServiceRole`, {
            assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
        });

        appRunnerServiceRole.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppRunnerServicePolicyForECRAccess'),
        );

        const appRunnerInstanceRole = new iam.Role(this, `${id}AppRunnerInstanceRole`, {
            assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
        });

        const ecrImageId = `${process.env.AWS_ACCOUNT_NO}.dkr.ecr.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ECR_REPOSITORY_NAME}:latest`;
        const appRunnerService = new cdk.aws_apprunner.CfnService(this, `${id}AppRunnerService`, {
            sourceConfiguration: {
                autoDeploymentsEnabled: true,
                imageRepository: {
                    imageRepositoryType: 'ECR',
                    imageIdentifier: ecrImageId,
                    imageConfiguration: {
                        port: '3000',
                        runtimeEnvironmentVariables: [
                            {
                                name: 'OPENAI_API_KEY',
                                value: process.env.OPENAI_API_KEY ?? '',
                            },
                            {
                                name: 'DATABASE_URL',
                                value: `postgresql://${databaseUser}:${databasePassword}@${postgres.instanceEndpoint.hostname}:5432/${databaseName}?schema=public`,
                            },
                            {
                                name: 'REDIS_HOST',
                                value: redis.attrRedisEndpointAddress,
                            },
                            {
                                name: 'REDIS_PORT',
                                value: redis.attrRedisEndpointPort,
                            },
                            {
                                name: 'RUN_MIGRATIONS',
                                value: 'true',
                            },
                        ],
                    },
                },
                authenticationConfiguration: {
                    accessRoleArn: appRunnerServiceRole.roleArn,
                },
            },
            networkConfiguration: {
                egressConfiguration: {
                    egressType: 'VPC',
                    vpcConnectorArn: appRunnerVpcConnector.attrVpcConnectorArn,
                },
            },
            serviceName: `${id}Api`,
            instanceConfiguration: {
                instanceRoleArn: appRunnerInstanceRole.roleArn,
            },
        });

        appRunnerService.node.addDependency(postgres);
        appRunnerService.node.addDependency(redis);

        // Terminal Outputs:
        new CfnOutput(this, 'ServiceUrl', {
            value: `https://${appRunnerService.attrServiceUrl}`,
        });
    }
}
