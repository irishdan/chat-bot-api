import { Controller, MessageEvent, Param, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('chats')
export class ChatSseAction {
    constructor(private eventEmitter: EventEmitter2) {}

    @Sse(':id/stream')
    async invoke(@Param('id') id: string): Promise<Observable<MessageEvent>> {
        return fromEvent(this.eventEmitter, `chat.message.${id}`).pipe(
            map((data) => {
                return new MessageEvent('chat.message', {
                    data: JSON.stringify(data),
                });
            }),
        );
    }
}
