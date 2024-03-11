import { Injectable, Logger } from '@nestjs/common';
import { Namespace } from 'socket.io';
import { Room, UserData, MatchData, Paddle, MatchResult } from './types';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketWithAuth } from 'src/types';
import { MatchHistoryRespository } from './repositories/match-history.repository';
import { CreateMatchHistoryDto } from './dto/create-match-history';
import { MatchHistoryEntity } from './entities/match-history';
import { WsException } from '@nestjs/websockets';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { UpdateUserGameStatisticDto } from 'src/users/dto/update-user-game-statistic';

@Injectable()
export class GameService {
  constructor(
    private readonly matchRepository: MatchHistoryRespository,
    private readonly usersRespository: UsersRepository,
  ) {}
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
  private timeToBeReady = 60 * 1000;
  private timeToReturnRequestMatch = 60 * 1000;

  throwError(client: SocketWithAuth, msg: string) {
    let player = this.findPlayerByUserID(client.userID);
    if (!player) {
      player = this.createNewPlayer(client.id, client.userID, client.username);
      this.players.push(player);
    } else {
      if (player.roomID) client.leave(player.roomID);
      if (player.status === 'playing') {
        const match = this.findMatchByUserID(player.userID);
        match.quitterID = player.userID;
        match.status = 'end';
        this.endMatch(match);
        this.removeMatchFromList(match);
      } else if (player.status === 'readyToPlay') {
        this.disconnectPlayerWhenStatusIsReadyToPlay(player);
      } else if (player.status === 'searching') {
        this.deleteRoomByRoomID(player.roomID);
        this.removePlayerFromList(player.userID);
      }
      player = this.createNewPlayer(
        player.socketID,
        player.userID,
        player.username,
      );
      this.updatePlayer(player);
    }
    client.emit('status_changed', `connected`);
    throw new WsException(msg);
  }

  isPlayerUserIDOnList(userID: number): boolean {
    return (
      this.players.filter(p => {
        return p.userID === userID;
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

  createNewPlayer(
    socketID: string,
    userID: number,
    username: string,
  ): UserData {
    const player: UserData = {
      socketID,
      userID,
      username,
      roomID: '',
      status: 'idle',
      waitingReconnect: false,
      isReconnect: false,
    };
    return player;
  }

  reconnectUserWhenStatusIsPlaying(
    player: UserData,
    client: SocketWithAuth,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const match = this.findMatchByUserID(player.userID);
    const room = this.findRoomByRoomID(player.roomID);
    this.removeUserFromRoom(room.ID, player.userID);
    room.users.push(player);
    client.join(room.ID);
    io.to(client.id).emit('status_changed', `playing`);
    io.to(match.player1.roomID).emit('match_updated', match);
  }

  reconnectUserWhenStatusIsReadyToPlay(
    player: UserData,
    client: SocketWithAuth,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const room = this.findRoomByRoomID(player.roomID);
    let remainingPlayer: UserData;
    const leavingPlayer = player;
    if (room.users[0].userID === player.userID) {
      remainingPlayer = this.findPlayerByUserID(room.users[1].userID);
    } else {
      remainingPlayer = this.findPlayerByUserID(room.users[0].userID);
    }
    this.removeUserFromQueue(leavingPlayer.userID);
    remainingPlayer.status = 'searching';
    this.updatePlayer(remainingPlayer);
    io.to(room.ID).emit('status_changed', 'searching');
    this.removeUserFromRoom(player.roomID, leavingPlayer.userID);
    (player.roomID = ''), (player.status = 'idle');
    this.updatePlayer(player);
    io.to(client.id).emit('status_changed', `connected`);
  }

  reconnectUserWhenStatusIsSearching(
    player: UserData,
    client: SocketWithAuth,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    this.deleteRoomByRoomID(player.roomID);
    player.roomID = '';
    player.status = 'idle';
    this.updatePlayer(player);
    io.to(client.id).emit('status_changed', `connected`);
  }

  populateUserList(
    client: SocketWithAuth,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ): UserData[] {
    if (!this.isPlayerUserIDOnList(client.userID)) {
      const player = this.createNewPlayer(
        client.id,
        client.userID,
        client.username,
      );
      this.players.push(player);
      io.to(client.id).emit('status_changed', `connected`);
    } else {
      const player = this.findPlayerByUserID(client.userID);
      player.isReconnect = true;
      this.updatePlayer(player);
      if (player.status === 'playing') {
        this.reconnectUserWhenStatusIsPlaying(player, client, io);
      } else if (player.status === 'readyToPlay') {
        this.reconnectUserWhenStatusIsReadyToPlay(player, client, io);
      } else if (player.status === 'searching') {
        this.reconnectUserWhenStatusIsSearching(player, client, io);
      }
    }
    return this.players;
  }

  removePlayerFromList(userID: number): UserData[] {
    this.players = this.players.filter(obj => {
      return obj.userID !== userID;
    });
    return this.players;
  }

  findPlayerByUserID(userID: number): UserData {
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
    if (room.length === 1) return room[0];
    else return undefined;
  }

  updatePlayer(player: UserData) {
    if (!this.isPlayerUserIDOnList(player.userID)) return;
    this.players = this.players.map(p =>
      p.userID === player.userID ? (p = player) : p,
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

  joinQueue(client: SocketWithAuth): UserData[] {
    const player: UserData = this.findPlayerByUserID(client.userID);
    if (!player || player.status !== 'idle') {
      this.throwError(client, 'error on join queue');
      return this.players;
    }
    player.status = 'searching';
    this.updatePlayer(player);
    return this.players;
  }

  notReadyInTime(
    roomID: string,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const room = this.findRoomByRoomID(roomID);
    if (!room || room.IsReady) return;

    const player1 = this.createNewPlayer(
      room.users[0].socketID,
      room.users[0].userID,
      room.users[0].username,
    );
    const player2 = this.createNewPlayer(
      room.users[1].socketID,
      room.users[1].userID,
      room.users[1].username,
    );
    this.updatePlayer(player1);
    this.updatePlayer(player2);

    io.to(room.ID).emit('not_ready_in_time', 'true');
    io.to(room.ID).emit('status_changed', 'connected');
    io.in(room.ID).socketsLeave(room.ID);
    this.deleteRoomByRoomID(room.ID);
  }

  joinRoom(
    client: SocketWithAuth,
    roomID: string,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ): Room {
    const room = this.findRoomByRoomID(roomID);
    if (!room) {
      this.throwError(client, 'error on join room');
      return;
    }

    const player1 = this.findPlayerByUserID(client.userID);
    const player2 = this.findPlayerByUserID(room.users[0].userID);
    if (!player1 || !player2) {
      this.throwError(client, 'error on join room');
      return;
    }

    player1.status = 'readyToPlay';
    player1.roomID = roomID;
    this.updatePlayer(player1);

    player2.status = 'readyToPlay';
    player2.roomID = roomID;
    this.updatePlayer(player2);

    client.join(roomID);
    room.users.push(player1);

    const now = new Date();
    room.ExpiredAt = new Date(now.getTime() + this.timeToBeReady);
    this.updateRoom(room);
    setTimeout(() => {
      this.notReadyInTime(room.ID, io);
    }, this.timeToBeReady);

    return room;
  }

  createRoom(client: SocketWithAuth): Room {
    const player1 = this.findPlayerByUserID(client.userID);
    if (!player1) {
      this.throwError(client, 'error on create room');
      return;
    }
    player1.roomID = client.id;
    this.updatePlayer(player1);

    const room: Room = {
      ID: client.id,
      users: [player1],
      IsReady: false,
      WasRequestReturned: false,
    };
    this.rooms.push(room);
    client.join(client.id);
    return room;
  }

  removeUserFromQueue(userID: number): UserData[] {
    const player = this.findPlayerByUserID(userID);
    if (!player) {
      return this.players;
    }

    const room = this.findRoomByRoomID(player.roomID);
    if (room && room.users.length === 1) this.deleteRoomByRoomID(room.ID);

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
      pausedByUserID: undefined,
      pausedAt: undefined,
      quitterID: undefined,
      isResumed: false,
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
    match.ball.direction.y = Math.floor(Math.random() * 100) % 2 == 0 ? 1 : -1;

    if (match.score.p1 === this.maxScore || match.score.p2 == this.maxScore) {
      this.updatePlayerUsernameByUserID(match.player1.userID)
      this.updatePlayerUsernameByUserID(match.player2.userID)
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

  async updateUser(matchResult: MatchResult) {
    const winner = await this.usersRespository.findOne(matchResult.winnerID);
    const looser = await this.usersRespository.findOne(matchResult.looserID);
    winner.total_games++;
    looser.total_games++;
    winner.total_wins++;
    looser.total_losses++;
    const winnerDto: UpdateUserGameStatisticDto =
      new UpdateUserGameStatisticDto();
    winnerDto.total_games = winner.total_games;
    winnerDto.total_wins = winner.total_wins;
    winnerDto.total_losses = winner.total_losses;
    await this.usersRespository.updateUserGameStatistic(
      winner.user_id,
      winnerDto,
    );
    const looserDto: UpdateUserGameStatisticDto =
      new UpdateUserGameStatisticDto();
    looserDto.total_games = looser.total_games;
    looserDto.total_wins = looser.total_wins;
    looserDto.total_losses = looser.total_losses;
    await this.usersRespository.updateUserGameStatistic(
      looser.user_id,
      looserDto,
    );
  }

  async saveMatchResult(matchResult: MatchResult) {
    const matchHistoryDto: CreateMatchHistoryDto = new CreateMatchHistoryDto();
    matchHistoryDto.player1_user_id = matchResult.player1.userID;
    matchHistoryDto.player1_username = matchResult.player1.username;
    matchHistoryDto.player1_score = matchResult.player1.score;
    matchHistoryDto.player1_avatar_url = matchResult.player1.avatarUrl;
    matchHistoryDto.player2_user_id = matchResult.player2.userID;
    matchHistoryDto.player2_username = matchResult.player2.username;
    matchHistoryDto.player2_score = matchResult.player2.score;
    matchHistoryDto.player2_avatar_url = matchResult.player2.avatarUrl;
    matchHistoryDto.winner_id = matchResult.winnerID;
    matchHistoryDto.looser_id = matchResult.looserID;
    matchHistoryDto.ended_at = matchResult.endedAt;
    await this.matchRepository.create(matchHistoryDto);
    await this.updateUser(matchResult);
  }

  async endMatch(match: MatchData): Promise<MatchResult> {
    const endedAt = new Date();
    let winnerID: number;
    let looserID: number;

    if (!match.quitterID) {
      if (match.score.p1 === this.maxScore) {
        winnerID = match.player1.userID;
        looserID = match.player2.userID;
      } else {
        looserID = match.player1.userID;
        winnerID = match.player2.userID;
      }
    } else {
      if (match.quitterID === match.player2.userID) {
        winnerID = match.player1.userID;
        looserID = match.player2.userID;
      } else {
        looserID = match.player1.userID;
        winnerID = match.player2.userID;
      }
    }

    const user1 = await this.usersRespository.findOne(match.player1.userID);
    const user2 = await this.usersRespository.findOne(match.player2.userID);

    const player1 = {
      userID: match.player1.userID,
      username: user1.username,
      score: match.score.p1,
      avatarUrl: user1.avatar_url ?? '',
    };

    const player2 = {
      userID: match.player2.userID,
      username: user2.username,
      score: match.score.p2,
      avatarUrl: user2.avatar_url ?? '',
    };

    const matchResult: MatchResult = {
      player1,
      player2,
      winnerID,
      looserID,
      endedAt,
    };

    await this.saveMatchResult(matchResult);
    return matchResult;
  }

  findMatchByUserID(userID: number): MatchData {
    const player = this.findPlayerByUserID(userID);
    const match = this.findMatchByRoomID(player.roomID);
    return match;
  }

  giveUpMatch(
    matchData: MatchData,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    client?: SocketWithAuth,
  ) {
    const match = this.findMatchByRoomID(matchData.roomID);
    if (!match || match.isResumed) return;
    this.updatePlayerUsernameByUserID(match.player1.userID)
    this.updatePlayerUsernameByUserID(match.player2.userID)

    match.status = 'end';
    match.quitterID = client ? client.userID : match.pausedByUserID;
    this.updateMatch(match);
    this.gameInProgress(match.roomID, io);
  }

  pauseMatch(
    userID: number,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const player = this.findPlayerByUserID(userID);
    const match = this.findMatchByRoomID(player.roomID);

    if (match && match.status === 'play') {
      match.isResumed = false;
      match.status = 'pause';
      match.pausedAt = new Date();
      match.pausedByUserID = player.userID;
      this.updateMatch(match);

      setTimeout(() => {
        this.giveUpMatch(match, io);
      }, 100 * 1000);

      this.updateMatch(match);
    }
  }

  resumeMatch(
    userID: number,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const player = this.findPlayerByUserID(userID);
    const match = this.findMatchByRoomID(player.roomID);

    if (match.pausedByUserID !== player.userID) return;

    match.isResumed = true;
    match.status = 'play';
    match.pausedAt = undefined;
    match.pausedByUserID = undefined;

    this.updateMatch(match);
    this.updatePlayerUsernameByUserID(match.player1.userID)
    this.updatePlayerUsernameByUserID(match.player2.userID)
    this.gameInProgress(player.roomID, io);
  }

  removeUserFromRoom(roomID: string, userID: number) {
    const room = this.findRoomByRoomID(roomID);
    if (!room) return;
    room.users = room.users.filter(u => {
      if (u.userID !== userID) return u;
    });
    this.updateRoom(room);
  }

  waitReconnect(
    client: SocketWithAuth,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const player = this.findPlayerByUserID(client.userID);
    if (!player) return;
    player.waitingReconnect = true;
    this.updatePlayer(player);

    if (player.status === 'playing') {
      this.pauseMatch(player.userID, io);
      client.leave(player.roomID);
    }

    setTimeout(() => {
      this.disconnectPlayer(client, io);
    }, 5000);
  }

  disconnectPlayerWhenStatusIsReadyToPlay(player: UserData): UserData {
    const room = this.findRoomByRoomID(player.roomID);
    let remainingPlayer: UserData;
    let leavingPlayer: UserData;
    if (room.users[0].userID === player.userID) {
      leavingPlayer = player;
      remainingPlayer = this.findPlayerByUserID(room.users[1].userID);
    } else {
      remainingPlayer = this.findPlayerByUserID(room.users[0].userID);
      leavingPlayer = player;
    }
    this.removeUserFromQueue(leavingPlayer.userID);
    this.removePlayerFromList(leavingPlayer.userID);
    remainingPlayer.status = 'searching';
    this.updatePlayer(remainingPlayer);
    room.users = room.users.filter(user => {
      if (user.userID !== leavingPlayer.userID) return user;
    });
    this.updateRoom(room);
    return remainingPlayer;
  }

  disconnectPlayer(
    client: SocketWithAuth,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const player = this.findPlayerByUserID(client.userID);
    if (!player) return;
    if (player.waitingReconnect && player.isReconnect) {
      player.waitingReconnect = false;
      player.isReconnect = false;
      this.updatePlayer(player);
      return;
    } else if (player.status === 'playing') {
      const match = this.findMatchByRoomID(player.roomID);
      this.giveUpMatch(match, io);
      return;
    } else if (player.status === 'readyToPlay') {
      const remainingPlayer =
        this.disconnectPlayerWhenStatusIsReadyToPlay(player);
      io.to(remainingPlayer.socketID).emit('status_changed', 'searching');
    } else if (player.status === 'searching') {
      this.deleteRoomByRoomID(player.roomID);
      this.removePlayerFromList(player.userID);
    } else {
      this.removePlayerFromList(player.userID);
    }
  }

  async gameInProgress(
    roomID: string,
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const match = this.findMatchByRoomID(roomID);
    if (match.status === 'end') {
      const matchResult = await this.endMatch(match);
      io.to(roomID).emit('end_match', matchResult);
      io.to(roomID).emit('status_changed', 'connected');
      io.socketsLeave(roomID);
      await this.updatePlayerStatus(match.player1.userID, 'online');
      await this.updatePlayerStatus(match.player2.userID, 'online');
      io.emit('refresh_list', ``);
      this.removeMatchFromList(match);
      return;
    }

    if (match.status === 'pause') {
      this.refreshMatch(match, io);
      return;
    }

    if (match.status === 'play') {
      this.moveBall(match);
      this.movePaddle(match);
      this.checkCollision(match);
    }

    this.refreshMatch(match, io);

    setTimeout(() => this.gameInProgress(match.roomID, io), 1000 / 60);
  }

  getAllMatchHistoryByUserID(
    userID: string,
  ): Promise<MatchHistoryEntity[] | null> {
    return this.matchRepository.getAllMatchHistoryByUserID(Number(userID));
  }

  async requestMatch(
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    client: SocketWithAuth,
    guestID: number,
  ) {
    const playerOwner = this.findPlayerByUserID(client.userID);
    const playerGuest = this.findPlayerByUserID(guestID);

    //todo testar com 3 usuarios logados, abrir um jogo com 2 e tentar chamar o 3 para game

    if (playerOwner.status !== 'idle') {
      client.emit(
        'request_game_error',
        'You are not allowed to play a new game.',
      );
      return;
    }

    if (!playerGuest) {
      client.emit('request_game_error', 'Player not found.');
      return;
    }

    const userGuest = await this.usersRespository.findOne(playerGuest.userID);
    if (userGuest.status !== 'online' || playerGuest.status !== 'idle') {
      client.emit('request_game_error', 'Player not available.');
      return;
    }

    const room = this.createRoom(client);
    room.users.push(playerGuest);

    playerOwner.status = 'awaiting';
    playerOwner.roomID = room.ID;
    this.updatePlayer(playerOwner);

    playerGuest.roomID = room.ID;
    this.updatePlayer(playerGuest);

    client.join(room.ID);

    this.updateRoom(room);

    client.emit('status_changed', 'awaiting');
    io.to(playerGuest.socketID).emit('request_game', {
      type: 'request',
      username: playerOwner.username,
    });
    setTimeout(() => {
      this.cancelRequestMatch(io, playerOwner.userID);
    }, this.timeToReturnRequestMatch);
  }

  cancelRequestMatch(
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    userID: number,
  ) {
    const playerOwner = this.findPlayerByUserID(userID);
    const room = this.findRoomByRoomID(playerOwner.roomID);
    if (!room)
      return;
    const playerGuest = this.findPlayerByUserID(
      room.users[0].userID === playerOwner.userID
        ? room.users[1].userID
        : room.users[0].userID,
    );

    if (room.WasRequestReturned) return;

    playerGuest.roomID = '';
    playerOwner.roomID = '';
    playerOwner.status = 'idle';

    io.to(room.ID).emit(
      'request_game_error',
      'The request was not responded in time.',
    );
    io.to(room.ID).emit('status_changed', 'connected');

    this.updatePlayer(playerGuest);
    this.updatePlayer(playerOwner);
    io.in(room.ID).socketsLeave(playerOwner.socketID);

    this.deleteRoomByRoomID(room.ID);
  }

  responseRequestMatch(
    io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    client: SocketWithAuth,
    response: string,
  ) {
    const playerGuest = this.findPlayerByUserID(client.userID);
    const room = this.findRoomByRoomID(playerGuest.roomID);
    if (!room) {
      client.emit('request_game_error', 'Request expired.');
      return;
    }
    const playerOwner = this.findPlayerByUserID(
      room.users[0].userID === client.userID
        ? room.users[1].userID
        : room.users[0].userID,
    );

    room.WasRequestReturned = true;
    this.updateRoom(room);

    if (response === 'refused') {
      playerGuest.roomID = '';
      this.updatePlayer(playerGuest);

      playerOwner.roomID = '';
      playerOwner.status = 'idle';
      io.to(room.ID).emit('request_game', {
        type: 'refused',
        username: playerGuest.username,
      });
      io.to(room.ID).emit('status_changed', 'connected');
      this.updatePlayer(playerOwner);
      io.in(room.ID).socketsLeave(playerOwner.socketID);

      this.deleteRoomByRoomID(room.ID);
      return;
    }
    playerOwner.status = 'readyToPlay';
    this.updatePlayer(playerOwner);

    playerGuest.status = 'readyToPlay';
    playerGuest.roomID = room.ID;
    this.updatePlayer(playerGuest);
    client.join(room.ID);

    const now = new Date();
    room.ExpiredAt = new Date(now.getTime() + this.timeToBeReady);
    this.updateRoom(room);
    io.to(room.ID).emit('status_changed', 'readyToPlay');
    io.to(room.ID).emit('time_to_be_ready', room.ExpiredAt);
    setTimeout(() => {
      this.notReadyInTime(room.ID, io);
    }, this.timeToBeReady);
  }

  async findFriends(userId: any): Promise<Friends[] | null> {
    return await this.usersRespository.findFriends(userId);
  }

  async setStatus(userId: any, status: string) {
    return await this.usersRespository.setStatus(userId, status);
  }

  async updatePlayerStatus(userID: number, status: string) {
    const user = await this.usersRespository.findOne(userID);
    if (user.status === 'offline') return;
    await this.setStatus(userID, status);
  }

  async updatePlayerUsernameByUserID(userID: number) {
    const user = await this.usersRespository.findOne(userID)
    let player = this.findPlayerByUserID(userID)
    if (!player)
      return;
    if (player.username !== user.username) {
      player.username = user.username
      this.updatePlayer(player)
      if (player.roomID !== '') {
        let room = this.findRoomByRoomID(player.roomID)
        room.users[0].userID === player.userID ?
          room.users[0].username = player.username :
          room.users[1].username = player.username
        this.updateRoom(room)
        let match = this.findMatchByRoomID(player.roomID)
        if (match) {
          match.player1.userID === player.userID ?
            match.player1.username = player.username :
            match.player2.username = player.username
          this.updateMatch(match)
        }
      }
    }
  }
}
