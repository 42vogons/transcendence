export type UserData = {
	socketID: string
	userID: string
	roomID: string
	status: 'idle' | 'searching' | 'readyToPlay' | 'playing'
}

export type Room = {
	ID: string
	users: UserData[]
}

export type Ball = {
	position: {
		x: number
		y: number
	}
	radius: number
	speed: {
		x: number
		y: number
	}
	direction: {
		x: 1 | -1
		y: 1 | -1
	}
}

export type Paddle = {
	position: {
		x: number
		y: number
	}
	width: number
	height: number
}

export type MatchData = {
	player1: UserData
	player2: UserData
	court: {
		width: number
		height: number
	}
	paddle1: Paddle
	paddle2: Paddle
	ball: Ball
	score: {
		p1: number
		p2: number
	}
	status: 'play' | 'pause' | 'end'
}
