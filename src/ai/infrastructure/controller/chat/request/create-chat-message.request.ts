import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateChatMessageRequest {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsOptional()
    type?: 'system' | 'human';
}
