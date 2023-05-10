import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class ChatsGateway implements OnGatewayDisconnect {
  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>
  ) {}

  private logger = new Logger('chat');

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<any> {
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      this.logger.log(`disconnected : ${socket.id}`);
      await user.deleteOne();
    }
  }

  @SubscribeMessage('new_user')
  async handleMessage(
    @MessageBody() userName: string,
    @ConnectedSocket() socket: Socket
  ): Promise<string> {
    const exist = await this.socketModel.exists({ username: userName });
    if (exist) userName = `${userName}_${Math.floor(Math.random() * 100)}`;
    await this.socketModel.create({
      id: socket.id,
      username: userName
    });

    socket.broadcast.emit('user_connected', userName);
    return userName;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });

    await this.chattingModel.create({
      user: socketObj,
      chat: chat
    });

    socket.broadcast.emit('new_chat', {
      chat,
      username: socket.id
    });
  }
}
