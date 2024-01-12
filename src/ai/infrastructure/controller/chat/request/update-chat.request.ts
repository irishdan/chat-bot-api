import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChatRequest {
    @IsString()
    @IsNotEmpty()
    title: string;
}
