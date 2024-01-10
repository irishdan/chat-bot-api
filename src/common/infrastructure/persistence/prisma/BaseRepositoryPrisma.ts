import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { PrismaService } from './PrismaService';
import DomainAbstractRoot from '../../../domain/DomainAbstractRoot';
import { CacheHandlerInterface } from '../../../domain/CacheHandlerInterface';

export default class BaseRepositoryPrisma {
    @Inject(PrismaService)
    protected readonly prisma: PrismaService;

    @Inject(EventPublisher)
    protected readonly eventPublisher: EventPublisher;

    @Inject('CacheHandlerInterface')
    protected cache: CacheHandlerInterface;

    protected async saveAndPublish<T extends DomainAbstractRoot>(
        model: T,
        prismaUpsertHandler: (model: T) => Promise<T>,
    ): Promise<T> {
        this.eventPublisher.mergeObjectContext(model);
        model.commit();

        await prismaUpsertHandler(model);

        const dto = model.getDto();
        await this.cache.set(dto);

        return model;
    }
}
