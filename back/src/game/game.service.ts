import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Room, UserData } from './types'

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private players:UserData[] = []
  private rooms:Room[] = []
  constructor() {}

  isPlayerSocketIDOnList(socketID: string): boolean {
	return this.players.filter(p => {
		return p.socketID === socketID
	}).length > 0
  }

  isRoomIDOnList(roomID: string): boolean {
	return this.rooms.filter(r => {
		return r.ID === roomID
	}).length > 0
  }

  populateUserList(client: Socket): UserData[] {
	if (!this.isPlayerSocketIDOnList(client.id)) {
		let player:UserData = {
			socketID: client.id,
			userID: "",
			roomID: "",
			status: "idle"
		}
		this.players.push(player)
	}
	return this.players
  }

  removePlayerFromList(client: Socket): UserData[] {
	this.players = this.players.filter((obj) => {
		return obj.socketID !== client.id
	});
	return this.players
  }

  findPlayerBySocketID(socketID: string): UserData {
	let player = this.players.filter(p => {
		return p.socketID === socketID
	})
	if (player.length == 1)
		return player[0]
	else 
		return undefined
  }

  findPlayerByStatus(status: string): UserData[] {
	return this.players.filter( p => {
		return p.status === status
	})
  }

  findRoomByRoomID(roomID: string): Room {
	let room = this.rooms.filter(r => {
		return r.ID === roomID
	})
	if (room.length == 1)
		return room[0]
	else 
		return undefined 
  }

  updatePlayer(player: UserData) {
	if (!this.isPlayerSocketIDOnList(player.socketID))
		return
	this.players = this.players.map(p => p.socketID === player.socketID ? p = player : p)
  }

  updateRoom(room: Room) {
	if (!this.isRoomIDOnList(room.ID))
		return
	this.rooms = this.rooms.map(r => r.ID === room.ID ? r = room : r)
  }

  deleteRoomByRoomID(roomID: string) {
	this.rooms = this.rooms.filter(r => {
		return r.ID !== roomID
	})
  }

  joinQueue(client: Socket, body: string): UserData[] {
	let player:UserData = this.findPlayerBySocketID(client.id)
	if (!player || player.status !== "idle")
		return this.players
	
	player.status = "searching"
	const { userID } = JSON.parse(body)
	player.userID = userID
	this.updatePlayer(player)
	return this.players
  }

  joinRoom(client: Socket, roomID: string): UserData[] {
	//todo: check for unvailable entities errors
	let room = this.findRoomByRoomID(roomID)
	if (!room)
		return this.players

	let player1 = this.findPlayerBySocketID(client.id)
	let player2 = this.findPlayerBySocketID(roomID)
	if (!player1 || !player2)
		return this.players

	player1.status === "readyToPlay"
	this.updatePlayer(player1)

	player2.status === "readyToPlay"
	this.updatePlayer(player2)

	client.join(roomID)
	room.users.push(player1)
	this.updateRoom(room)

	return this.players
  }

  createRoom(client: Socket) {
	let player1 = this.findPlayerBySocketID(client.id)
	if (!player1)
		return
	player1.roomID = client.id
	this.updatePlayer(player1)

	let room:Room = {
		ID: client.id,
		users: [player1]
	}
	this.updateRoom(room)
	client.join(client.id)
  }

  removeUserFromQueue(client: Socket): UserData[] {
	let player = this.findPlayerBySocketID(client.id)
	if (!player)
		return this.players
	
	let room = this.findRoomByRoomID(player.roomID)
	if (room)
		this.deleteRoomByRoomID(room.ID)

	player.status = "idle"
	player.roomID = ""
	this.updatePlayer(player)

	return this.players
  }
}
