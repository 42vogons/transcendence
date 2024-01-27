export type UserData = {
  socketID: string;
  userID: string;
  roomID: string;
  status: 'idle' | 'searching' | 'readyToPlay' | 'playing';
};

export type Room = {
  ID: string;
  users: UserData[];
};

export type Ball = {
  position: {
    x: number;
    y: number;
  };
  radius: number;
  speed: {
    x: number;
    y: number;
  };
  direction: {
    x: 1 | -1;
    y: 1 | -1;
  };
};

export type Paddle = {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  direction: "UP" | "DOWN" | "STOP"
};

export type MatchData = {
  roomID: string;
  player1: UserData & Paddle;
  player2: UserData & Paddle;
  court: {
    width: number;
    height: number;
  };
  ball: Ball;
  score: {
    p1: number;
    p2: number;
  };
  status: 'play' | 'pause' | 'end';
  pausedBy: string;
  pausedAt: Date;
  quitterID: string;
};

export type MatchResult = {
	player1: {
		userID: string
		score: number
	};
	player2: {
		userID: string
		score: number
	};
	winner: string
	looser: string
	endedAt: Date
}
