import DtoInterface from '../../../../../common/application/query/dto/dto.interface';

export class ChatDto implements DtoInterface {
    public static version = 1;

    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly createdAt: Date,
        public readonly messageCount: number = 0,
    ) {}

    getId(): string {
        return this.id;
    }

    getVersion(): number {
        return ChatDto.version;
    }
}
