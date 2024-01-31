import { Socket } from 'socket.io';

export type AuthPayload = {
  userID: number;
  username: string;
};

export type SocketWithAuth = Socket & AuthPayload;
