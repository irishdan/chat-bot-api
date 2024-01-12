import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { PrismaService } from './prisma.service';
import DomainAggregateRoot from '../../../domain/domain.aggregate-root';
import { CacheHandlerInterface } from '../../../domain/cache-handler.interface';

export default class BaseRepositoryPrisma {
    @Inject(PrismaService)
    protected readonly prisma: PrismaService;

    @Inject(EventPublisher)
    protected readonly eventPublisher: EventPublisher;

    @Inject('CacheHandlerInterface')
    protected cache: CacheHandlerInterface;

    protected async saveAndPublish<T extends DomainAggregateRoot>(
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
