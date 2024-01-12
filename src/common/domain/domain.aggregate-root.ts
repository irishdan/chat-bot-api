import { AggregateRoot } from '@nestjs/cqrs';
import DtoInterface from '../application/query/dto/dto.interface';

abstract class DomainAggregateRoot extends AggregateRoot {
    constructor() {
        super();
    }

    abstract getDto(): DtoInterface;
}

export default DomainAggregateRoot;
