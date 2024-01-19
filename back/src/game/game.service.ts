import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserData } from './types'

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private queue:UserData[] = []
  constructor() {}

  joinQueue(client: Socket, body: string): UserData[] {
	const validate = this.queue.filter((obj) => {
		return obj.socketID === client.id
	})
	if (validate.length > 0)
		return this.queue

	const { userID } = JSON.parse(body)
	const userData = {
		socketID: client.id,
		userID
	}
	this.queue.push(userData)
	return this.queue
  }

  joinRoom(client: Socket, roomID: string): UserData[] {
	client.join(roomID)
	this.removeUsersFromQueue(client.id, roomID)
	return this.queue
  }

  createRoom(client: Socket) {
	client.join(client.id)
  }

  removeUsersFromQueue(firstUserID: string, secondUserID: string) {
	this.queue = this.queue.filter((obj) => {
		return obj.socketID !== firstUserID && obj.socketID !== secondUserID
	});
  }
}
