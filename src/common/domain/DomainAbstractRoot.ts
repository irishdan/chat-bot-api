import { AggregateRoot } from '@nestjs/cqrs';
import DtoInterface from '../application/query/dto/DtoInterface';

abstract class DomainAbstractRoot extends AggregateRoot {
    constructor() {
        super();
    }

    abstract getDto(): DtoInterface;
}

export default DomainAbstractRoot;
