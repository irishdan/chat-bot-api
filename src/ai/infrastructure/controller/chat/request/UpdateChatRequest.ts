import { ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import CreateChatMessageRequest from './CreateChatMessageRequest';

export class UpdateChatRequest {
    @ValidateNested({ each: true })
    @Type(() => CreateChatMessageRequest)
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    messages: CreateChatMessageRequest[];
}
