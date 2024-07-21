import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

@Controller()
export class HealthCheckAction {
    constructor(private queryBus: QueryBus) {}

    @Get()
    async invoke() {
        return { status: 'ok' };
    }
}
