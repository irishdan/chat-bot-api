import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatRequest {
    @IsString()
    @IsNotEmpty()
    title: string;
}
