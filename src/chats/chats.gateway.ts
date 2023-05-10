import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatsGateway {
  @SubscribeMessage('new_user')
  handleMessage(
    @MessageBody() userName: string,
    @ConnectedSocket() socket: Socket
  ): string {
    socket.broadcast.emit('user_connected', userName);
    return userName;
  }
}
