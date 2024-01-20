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
import { UserData } from './types';

@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);
  private players:UserData[] = []
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  handleConnection(client: Socket) {
    const sockets = this.io.sockets;

	this.players = this.gameService.populateUserList(client)

    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    client.emit('connected', `from ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

	this.players = this.gameService.removePlayerFromList(client)

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('join_queue')
  handleJoinQueueEvent(client: Socket, body: string) {
    this.players = this.gameService.joinQueue(client, body);
	let availablePlayers = this.gameService.findPlayerByStatus("searching")
	availablePlayers = availablePlayers.filter(p => {
		return p.socketID !== client.id
	})
	console.log("availablePlayers: ", availablePlayers)

	if (availablePlayers.length > 0) {
		const roomID = availablePlayers[0].socketID
		this.players = this.gameService.joinRoom(client, roomID);
		this.io.to(roomID).emit('match_found', 'found');
	}  else {
      this.gameService.createRoom(client);
	  client.emit("match_found", "searching")
    }
	console.log("players: ", this.players)
  }

  @SubscribeMessage('exit_queue')
  handleExitQueueEvent(client: Socket) {
    this.players = this.gameService.removeUserFromQueue(client)
  }
}
