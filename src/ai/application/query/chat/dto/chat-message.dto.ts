import DtoInterface from '../../../../../common/application/query/dto/dto.interface';

export class ChatMessageDto implements DtoInterface {
    public static readonly version = 1;

    constructor(
        public readonly id: string,
        public readonly message: string,
        public readonly type: 'system' | 'human' | 'ai',
        public readonly createdAt: Date,
        public readonly chatId?: string,
        public readonly promptMessageId?: string,
    ) {}

    getId(): string {
        return this.id;
    }

    getVersion(): number {
        return ChatMessageDto.version;
    }
}
