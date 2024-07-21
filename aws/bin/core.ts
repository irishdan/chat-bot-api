#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path = require('path');
import { ChatBotStack } from '../lib/chat-bot-stack';

const envPath = path.resolve(__dirname, '../.env');

if (!fs.existsSync(envPath)) {
    throw new Error('.env file is missing');
}

dotenv.config({ path: envPath });

const app = new cdk.App();
new ChatBotStack(app, 'ChatBotStack', {
    env: {
        account: process.env.AWS_ACCOUNT_NO,
        region: process.env.AWS_REGION,
    },
});
