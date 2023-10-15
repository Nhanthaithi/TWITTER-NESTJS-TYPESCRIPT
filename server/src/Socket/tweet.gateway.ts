import { Server, Socket } from 'socket.io';

import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
@Injectable()
export class TweetGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  // Khi một kết nối socket được tạo
  handleConnection(client: Socket) {
    // Lắng nghe sự kiện khi người dùng tham gia vào một phòng (room)
    console.log(`Client connected: ${client.id}`);
  }
  // Hàm gửi thông báo đến người tạo tweet khi có người khác thích tweet hoặc bình luận
  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: string) {
    console.log(`Received message from client: ${payload}`);
    this.server.emit('messageToClient', payload);
  }
  sendNotificationToUser(userId: string, eventType: string, senderId: string) {
    // Kiểm tra xem người dùng có kết nối WebSocket không
    const userSocket = this.server.sockets.sockets.get(userId);
    if (userSocket) {
      // Gửi thông báo đến người dùng
      userSocket.emit(eventType, { senderId });
    }
  }
}
