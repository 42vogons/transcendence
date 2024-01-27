import { Injectable, Logger } from '@nestjs/common';
import { Namespace, Socket } from 'socket.io';
import { Room, UserData, MatchData, Paddle, MatchResult } from './types';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@Injectable()
export class GameService {
  //todo: remover quando implementar conexao com o banco de dados
  private matchsResults: MatchResult[] = [];

  private readonly logger = new Logger(GameService.name);
  private players: UserData[] = [];
  private rooms: Room[] = [];
  private matchs: MatchData[] = [];
  private maxScore = 5;
  private court = { width: 200, height: 100 };
  private paddle = {
    width: this.court.width * 0.01,
    height: this.court.height * 0.25,
  };
  private paddleInitialPosition = {
    x: this.court.width * 0.02,
    y: this.court.height / 2 - this.paddle.height / 2,
  };
  private ballRadius = this.court.height * 0.025;
  private ballSpeed = {
    x: this.court.width * 0.005,
    y: this.court.height * 0.005,
  };
  private paddleSpeed = this.paddle.height * 0.2;
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

  findMatchByRoomID(roomID: string): MatchData {
    const match = this.matchs.filter(m => {
      return m.roomID === roomID;
    });
    if (match.length == 1) return match[0];
    else return undefined;
  }

  isMatchIDOnList(roomID: string): boolean {
    return (
      this.matchs.filter(m => {
        return m.roomID === roomID;
      }).length > 0
    );
  }

  updateMatch(match: MatchData) {
    if (!this.isMatchIDOnList(match.roomID)) return;
    this.matchs = this.matchs.map(m =>
      m.roomID === match.roomID ? (m = match) : m,
    );
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
    const matchData: MatchData = {
      roomID: room.ID,
      player1: {
        ...room.users[0],
        position: {
          x: this.paddleInitialPosition.x - this.paddle.width,
          y: this.paddleInitialPosition.y,
        },
        width: this.paddle.width,
        height: this.paddle.height,
        direction: 'STOP',
      },
      player2: {
        ...room.users[1],
        position: {
          x:
            this.court.width - this.paddleInitialPosition.x - this.paddle.width,
          y: this.paddleInitialPosition.y,
        },
        width: this.paddle.width,
        height: this.paddle.height,
        direction: 'STOP',
      },
      court: this.court,
      ball: {
        position: {
          x: this.court.width / 2 - this.ballRadius,
          y: this.court.height / 2 - this.ballRadius,
        },
        radius: this.ballRadius,
        speed: this.ballSpeed,
        direction: {
          x: Math.floor(Math.random() * 100) % 2 == 0 ? 1 : -1,
          y: Math.floor(Math.random() * 100) % 2 == 0 ? 1 : -1,
        },
      },
      score: {
        p1: 0,
        p2: 0,
      },
      status: 'play',
      pausedBy: '',
      pausedAt: undefined,
      quitterID: '',
	  isResumed: false
    };
    this.matchs.push(matchData);
    return matchData;
  }

  moveBall(matchData: MatchData) {
    const x =
      matchData.ball.position.x +
      matchData.ball.speed.x * matchData.ball.direction.x;
    const y =
      matchData.ball.position.y +
      matchData.ball.speed.y * matchData.ball.direction.y;
    matchData.ball.position = { x, y };
  }

  movePaddle(match: MatchData) {
    [1, 2].forEach(i => {
      const player: UserData & Paddle = match[`player${i}`];

      switch (player.direction) {
        case 'UP':
          player.position.y -= this.paddleSpeed;
          break;
        case 'DOWN':
          player.position.y += this.paddleSpeed;
          break;
      }

      if (player.position.y < 0) {
        player.position.y = 0;
      } else if (player.position.y + player.height * 1.05 > this.court.height) {
        player.position.y = this.court.height - player.height * 1.05;
      }
    });
  }

  restartMatch(match: MatchData) {
    match.ball.position.x = this.court.width / 2 - this.ballRadius;
    match.ball.position.y = this.court.height / 2 - this.ballRadius;
    match.ball.direction.x *= -1;

    if (match.score.p1 === this.maxScore || match.score.p2 == this.maxScore) {
      match.status = 'end';
    }
  }

  checkCollision(matchData: MatchData) {
    const ball = matchData.ball;

    if (
      ball.position.y > matchData.court.height - 2.5 * this.ballRadius ||
      ball.position.y < 0
    ) {
      matchData.ball.direction.y *= -1;
    }

    if (ball.position.y < this.ballRadius) {
      ball.position.y = this.ballRadius * 2;
      ball.direction.y = 1;
    }

    const { x: bx, y: by } = ball.position;
    const br = this.ballRadius;

    const playerNumber = bx < this.court.width / 2 ? 1 : 2;
    const player = `player${playerNumber}`;
    const { x: px, y: py } = matchData[player].position;
    const { width: pw, height: ph } = matchData[player];

    let testX = bx;
    let testY = by;

    if (bx < px) {
      testX = px;
    } else if (bx > px + pw) {
      testX = px + pw;
    }

    if (by < py) {
      testY = py;
    } else if (by > py + ph) {
      testY = py + ph;
    }

    const distX = bx - testX;
    const distY = by - testY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (
      by >= py &&
      by <= py + ph &&
      ((playerNumber === 1 && bx < px + pw) ||
        (playerNumber === 2 && bx > px - 2 * br))
    ) {
      ball.direction.x *= -1;
      ball.position.x =
        playerNumber === 1
          ? matchData[player].position.x + matchData[player].width + br * 0.2
          : matchData[player].position.x - br * 2;

      matchData = { ...matchData, ball };
    } else if (ball.position.x < matchData.player1.position.x - pw) {
      matchData.score.p2++;
      this.restartMatch(matchData);
    } else if (ball.position.x > matchData.player2.position.x + pw - br) {
      matchData.score.p1++;
      this.restartMatch(matchData);
    }
  }

  refreshMatch(
    matchData: MatchData,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    this.updateMatch(matchData);
    io.to(matchData.player1.roomID).emit('match_updated', matchData);
  }

  removeMatchFromList(matchData: MatchData): MatchData[] {
    const match = this.findMatchByRoomID(matchData.roomID);
    if (!match) return this.matchs;

    const room = this.findRoomByRoomID(matchData.roomID);
    if (room) this.deleteRoomByRoomID(room.ID);

    const player1 = match.player1;
    const player2 = match.player2;

    player1.roomID = '';
    player2.roomID = '';
    player1.status = 'idle';
    player2.status = 'idle';

    this.updatePlayer(player1);
    this.updatePlayer(player2);

    this.matchs = this.matchs.filter(m => {
      return m.roomID !== match.roomID;
    });
    return this.matchs;
  }

  saveMatchResult(matchResult: MatchResult) {
    this.matchsResults.push(matchResult);
  }

  endMatch(match: MatchData): MatchResult {
    const endedAt = new Date();
    let winner: string;
    let looser: string;

    if (!match.quitterID) {
      if (match.score.p1 === this.maxScore) {
        winner = match.player1.userID;
        looser = match.player2.userID;
      } else {
        looser = match.player1.userID;
        winner = match.player2.userID;
      }
    } else {
		if (match.quitterID === match.player2.userID) {
			winner = match.player1.userID;
			looser = match.player2.userID;
		} else {
			looser = match.player1.userID;
			winner = match.player2.userID;
		}
    }

    const player1 = {
      userID: match.player1.userID,
      score: match.score.p1,
    };

    const player2 = {
      userID: match.player2.userID,
      score: match.score.p2,
    };

    const matchResult: MatchResult = {
      player1,
      player2,
      winner,
      looser,
      endedAt,
    };

    this.saveMatchResult(matchResult);
    return matchResult;
  }

  findMatchBySocketID(socketID: string): MatchData {
	const player = this.findPlayerBySocketID(socketID)
	const match = this.findMatchByRoomID(player.roomID)
	return match
  }

  giveUpMatch(matchData: MatchData, io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
	let match = this.findMatchByRoomID(matchData.roomID)

	if(match.isResumed)
	 return

	match.status = "end"
	match.quitterID = match.pausedBy
	this.updateMatch(match)
	this.gameInProgress(match.roomID, io)
  }

  pauseMatch(sockerID: string, io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
	const player = this.findPlayerBySocketID(sockerID)
	let match = this.findMatchByRoomID(player.roomID)

	match.isResumed = false
	match.status = "pause"
	match.pausedAt = new Date()
	match.pausedBy = player.userID
	this.updateMatch(match)

	const timer = setTimeout(() => {
        this.giveUpMatch(match, io);
      }, 10000);


	this.updateMatch(match)
  }

  resumeMatch(sockerID: string,
	io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	) {

	const player = this.findPlayerBySocketID(sockerID)
	let match = this.findMatchByRoomID(player.roomID)

	if (match.pausedBy !== player.userID)
		return

	match.isResumed = true
	match.status = "play"
	match.pausedAt = undefined
	match.pausedBy = ''

	this.updateMatch(match)
	this.gameInProgress(player.roomID, io)
  }

  gameInProgress(
    roomID: string,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const match = this.findMatchByRoomID(roomID);
    if (match.status === 'end') {
      const matchResult = this.endMatch(match);
      io.to(roomID).emit('end_match', matchResult);
      io.to(roomID).emit('status_changed', 'connected');
      this.removeMatchFromList(match);
      return;
    }

	if (match.status === 'pause') {
		this.refreshMatch(match, io);
		return
	}

    if (match.status === 'play') {
      this.moveBall(match);
      this.movePaddle(match);
      this.checkCollision(match);
    }

    this.refreshMatch(match, io);

    setTimeout(() => this.gameInProgress(match.roomID, io), 1000 / 60);
  }
}
