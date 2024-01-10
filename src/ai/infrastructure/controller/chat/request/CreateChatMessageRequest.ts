import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateChatMessageRequest {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    type: 'system' | 'human';
}
