import { Injectable, Logger } from '@nestjs/common';
import { Namespace, Socket } from 'socket.io';
import { Room, UserData, MatchData } from './types';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private players: UserData[] = [];
  private rooms: Room[] = [];
  private court = {width: 200, height: 100};
  private paddle = {width: this.court.width * 0.1, height: this.court.height * 0.2}
  private paddleInitialPosition = {x: this.court.width * 0.05, y: this.court.height / 2 - this.paddle.height / 2};
  private ballRadius = this.court.height * 0.025
  private ballSpeed = {x: this.court.width * 0.01, y: this.court.height * 0.01}
  constructor() {}

  isPlayerSocketIDOnList(socketID: string): boolean {
    return (
      this.players.filter(p => {
        return p.socketID === socketID;
      }).length > 0
    );
  }

  isRoomIDOnList(roomID: string): boolean {
    return (
      this.rooms.filter(r => {
        return r.ID === roomID;
      }).length > 0
    );
  }

  populateUserList(client: Socket): UserData[] {
    if (!this.isPlayerSocketIDOnList(client.id)) {
      const player: UserData = {
        socketID: client.id,
        userID: '',
        roomID: '',
        status: 'idle',
      };
      this.players.push(player);
    }
    return this.players;
  }

  removePlayerFromList(client: Socket): UserData[] {
    this.players = this.players.filter(obj => {
      return obj.socketID !== client.id;
    });
    return this.players;
  }

  findPlayerBySocketID(socketID: string): UserData {
    const player = this.players.filter(p => {
      return p.socketID === socketID;
    });
    if (player.length == 1) return player[0];
    else return undefined;
  }

  findPlayerByUserID(userID: string): UserData {
    const player = this.players.filter(p => {
      return p.userID === userID;
    });
    if (player.length == 1) return player[0];
    else return undefined;
  }

  findPlayerByStatus(status: string): UserData[] {
    return this.players.filter(p => {
      return p.status === status;
    });
  }

  findRoomByRoomID(roomID: string): Room {
    const room = this.rooms.filter(r => {
      return r.ID === roomID;
    });
    if (room.length == 1) return room[0];
    else return undefined;
  }

  updatePlayer(player: UserData) {
    if (!this.isPlayerSocketIDOnList(player.socketID)) return;
    this.players = this.players.map(p =>
      p.socketID === player.socketID ? (p = player) : p,
    );
  }

  updateRoom(room: Room) {
    if (!this.isRoomIDOnList(room.ID)) return;
    this.rooms = this.rooms.map(r => (r.ID === room.ID ? (r = room) : r));
  }

  deleteRoomByRoomID(roomID: string) {
    this.rooms = this.rooms.filter(r => {
      return r.ID !== roomID;
    });
  }

  joinQueue(client: Socket, body: string): UserData[] {
    const player: UserData = this.findPlayerBySocketID(client.id);
    if (!player || player.status !== 'idle') return this.players;

    player.status = 'searching';
    const { userID } = JSON.parse(body);
    player.userID = userID;
    this.updatePlayer(player);
    return this.players;
  }

  joinRoom(client: Socket, roomID: string): UserData[] {
    //todo: check for unvailable entities errors
    const room = this.findRoomByRoomID(roomID);
    if (!room) {
      return this.players;
    }

    const player1 = this.findPlayerBySocketID(client.id);
    const player2 = this.findPlayerBySocketID(roomID);
    if (!player1 || !player2) {
      return this.players;
    }

    player1.status = 'readyToPlay';
    player1.roomID = roomID;
    this.updatePlayer(player1);

    player2.status = 'readyToPlay';
    this.updatePlayer(player2);

    client.join(roomID);
    room.users.push(player1);
    this.updateRoom(room);

    return this.players;
  }

  createRoom(client: Socket) {
    const player1 = this.findPlayerBySocketID(client.id);
    if (!player1) return;
    player1.roomID = client.id;
    this.updatePlayer(player1);

    const room: Room = {
      ID: client.id,
      users: [player1],
    };
    this.rooms.push(room);
    client.join(client.id);
  }

  removeUserFromQueue(client: Socket): UserData[] {
    const player = this.findPlayerBySocketID(client.id);
    if (!player) return this.players;

    const room = this.findRoomByRoomID(player.roomID);
    if (room) this.deleteRoomByRoomID(room.ID);

    player.status = 'idle';
    player.roomID = '';
    this.updatePlayer(player);

    return this.players;
  }

  loadGame(room: Room): MatchData {
	let macthData: MatchData = {
		player1: room.users[0],
		player2: room.users[1],
		court: this.court,
		paddle1: {
			position: {
				x: this.paddleInitialPosition.x,
				y: this.paddleInitialPosition.y
			},
			width: this.paddle.width,
			height: this.paddle.height
		},
		paddle2: {
			position: {
				x: this.court.width - this.paddleInitialPosition.x,
				y: this.paddleInitialPosition.y
			},
			width: this.paddle.width,
			height: this.paddle.height
		},
		ball: {
			position: {
				x: this.court.width / 2 - this.ballRadius,
				y: this.court.height / 2 - this.ballRadius
			},
			radius: this.ballRadius,
			speed: this.ballSpeed,
			direction: {
				x: 1,
				y: 1
			}
		},
		score: {
			p1: 0,
			p2: 0
		},
		status: 'play'
	}
	return macthData
  }

  moveBall(macthData: MatchData) {
	const x = macthData.ball.position.x + macthData.ball.speed.x * macthData.ball.direction.x;
  	const y = macthData.ball.position.y + macthData.ball.speed.y * macthData.ball.direction.y;
	macthData.ball.position = {x, y}
  }

  movePaddle(macthData: MatchData) {
	return
  }

  checkCollision(macthData: MatchData) {
	const ballXPos =  macthData.ball.position.x
	const ballYPos =  macthData.ball.position.y

	if (ballXPos > macthData.court.width - this.ballRadius  || ballXPos < this.ballRadius) {
		macthData.ball.direction.x *= -1;
	}

	if (ballYPos > macthData.court.height - this.ballRadius ||  ballYPos < this.ballRadius) {
		macthData.ball.direction.y *= -1;
	}

	if (ballXPos < this.ballRadius) {
		macthData.score.p2++;
	}

	if (ballXPos > macthData.court.width - this.ballRadius) {
		macthData.score.p1++;
	}
  }

  refreshMatch(matchData: MatchData, io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
	io.to(matchData.player1.roomID).emit('match_updated', matchData)
  }

  gameInProgress(matchData: MatchData, io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
	console.log("time: ", new Date().toLocaleString(), "\n", matchData)
	if (matchData.status === 'end')
		return;

	if (matchData.status === 'play') {
		this.moveBall(matchData);
		this.movePaddle(matchData);
		this.checkCollision(matchData);
	}

	this.refreshMatch(matchData, io);

	setTimeout(() => this.gameInProgress(matchData, io), 1000 / 30);
  }
}
