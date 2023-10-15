import { Server, Socket } from 'socket.io';

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Xử lý khi một người dùng kết nối
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Gửi tin nhắn chào mừng cho người dùng mới kết nối
    client.emit('chatMessage', {
      sender: 'Server',
      message: 'Welcome to the chat!',
    });
  }

  // Xử lý khi một người dùng ngắt kết nối
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Thực hiện xử lý khi một người dùng ngắt kết nối, ví dụ: thông báo cho tất cả người dùng khác
    this.server.emit('chatMessage', {
      sender: 'Server',
      message: `User ${client.id} has left the chat.`,
    });
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, data: { sender: string; message: string }) {
    // Xử lý khi nhận được tin nhắn từ người dùng và gửi lại cho tất cả người dùng khác
    this.server.emit('chatMessage', data);
  }
}
