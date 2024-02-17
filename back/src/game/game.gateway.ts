import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { GameService } from './game.service';
import { UserData } from './types';
import { SocketWithAuth } from 'src/types';

@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);
  private players: UserData[] = [];
  constructor(private readonly gameService: GameService) { }

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.players = this.gameService.populateUserList(client, this.io);

    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    this.gameService.waitReconnect(client, this.io)

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${this.io.sockets.size}`);
  }

  @SubscribeMessage('join_queue')
  handleJoinQueueEvent(client: SocketWithAuth) {
    this.players = this.gameService.joinQueue(client);
    let availablePlayers = this.gameService.findPlayerByStatus('searching');
    availablePlayers = availablePlayers.filter(p => {
      return p.userID !== client.userID;
    });

    if (availablePlayers.length > 0) {
      const roomID = availablePlayers[0].roomID;
      this.players = this.gameService.joinRoom(client, roomID, this.io);
      this.io.to(roomID).emit('status_changed', 'readyToPlay');
    } else {
      this.gameService.createRoom(client);
      client.emit('status_changed', 'searching');
    }
  }

  @SubscribeMessage('exit_queue')
  handleExitQueueEvent(client: SocketWithAuth) {
    this.players = this.gameService.removeUserFromQueue(client.userID);
    client.emit('status_changed', 'connected');
  }

  @SubscribeMessage('send_key')
  handleKeyEvent(client: SocketWithAuth, data) {
    const { type, key } = data;
    const direction =
      type === 'keyup' ? 'STOP' : key.replace('Arrow', '').toUpperCase();
    const player = this.gameService.findPlayerByUserID(client.userID);
    const match = this.gameService.findMatchByRoomID(player.roomID);
    if (match.player1.userID === player.userID)
      match.player1.direction = direction;
    else if (match.player2.userID === player.userID)
      match.player2.direction = direction;
    this.gameService.updateMatch(match);
  }

  @SubscribeMessage('playing')
  handlePlayingEvent(client: SocketWithAuth) {
    const player = this.gameService.findPlayerByUserID(client.userID);
    const room = this.gameService.findRoomByRoomID(player.roomID);
    room.IsReady = true;
    const users = room.users.map(user => {
      if (user.socketID === player.socketID) user.status = 'playing';
      return user;
    });
    player.status = 'playing';
    this.gameService.updatePlayer(player);
    room.users = users;
    this.gameService.updateRoom(room);
    if (
      room.users[0].status === 'playing' &&
      room.users[1].status === 'playing'
    ) {
      const matchData = this.gameService.loadGame(room);
      this.io.to(room.ID).emit('status_changed', 'playing');
      this.gameService.gameInProgress(matchData.roomID, this.io);
    }
  }

  @SubscribeMessage('pause')
  handlePausePlaying(client: SocketWithAuth, data) {
    const { type } = data;
    if (type === 'keydown') {
      this.gameService.pauseMatch(client.userID, this.io);
    }
  }

  @SubscribeMessage('resume')
  handleResumePlaying(client: SocketWithAuth) {
    this.gameService.resumeMatch(client.userID, this.io);
  }

  @SubscribeMessage('give_up')
  handleGiveUpMatch(client: SocketWithAuth) {
    const match = this.gameService.findMatchByUserID(client.userID)
    this.gameService.giveUpMatch(match, this.io, client)
  }
}
