import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  handleConnection(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    client.emit('connected', `from ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    // this.io.emit('bye', `good bye ${client.id}`);
  }

  @SubscribeMessage('join_queue')
  handleEvent(client: Socket, body: string) {
    let queue = this.gameService.joinQueue(client, body);
    if (queue.length % 2 == 0) {
      const roomID = queue[0].socketID;
      queue = this.gameService.joinRoom(client, roomID);
      this.io.to(roomID).emit('match_found', 'found');
    } else {
      this.gameService.createRoom(client);
    }
    console.log(queue);
  }
}
