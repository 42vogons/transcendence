import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PlayService } from "./play.service";
import { Logger } from "@nestjs/common";
import { Namespace, Socket } from "socket.io";

@WebSocketGateway({
	namespace: "play"
})
export class PlayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(PlayGateway.name);
	constructor(private readonly playService: PlayService) {}

	@WebSocketServer() io: Namespace;

	afterInit(): void {
		this.logger.log('Websocket gateway initialized.')
	}

	handleConnection(client: Socket) {
		const sockets = this.io.sockets;

		this.logger.log(`WS Client with id: ${client.id} connected`);
		this.logger.debug(`Number of connected sockets: ${sockets.size}`)

		this.io.emit('hello', `from ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		const sockets = this.io.sockets;

		this.logger.log(`Disconnected socket id: ${client.id}`);
		this.logger.debug(`Number of connected sockets: ${sockets.size}`)
	}
}
