export type UserData = {
	socketID: string
	userID: number
	username: string
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
	direction: 'UP' | 'DOWN' | 'STOP'
}

export type MatchData = {
	roomID: string
	player1: UserData & Paddle
	player2: UserData & Paddle
	court: {
		width: number
		height: number
	}
	ball: Ball
	score: {
		p1: number
		p2: number
	}
	status: 'play' | 'pause' | 'end'
	pausedByUserID: number
	pausedAt: Date
	quitterID: number
	isResumed: boolean
}

export type MatchResult = {
	player1: {
		userID: number
		username: string
		score: number
	}
	player2: {
		userID: number
		username: string
		score: number
	}
	winnerID: number
	looserID: number
	endedAt: Date
}
