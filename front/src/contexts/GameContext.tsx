import { matchUpdate, statusChange } from '@/reducers/Game/Action'
import { GameReducer } from '@/reducers/Game/Reducer'
import { MatchData } from '@/reducers/Game/Types'
import { useRouter } from 'next/router'
import { ReactNode, createContext, useEffect, useReducer } from 'react'
import socketClient from 'socket.io-client'

interface GameContextType {
	status: string
	match: MatchData
	sendKey: (type: string, key: string) => void
	joinQueue: (userID: string) => void
	exitQueue: () => void
	playing: () => void
}

interface GameProviderProps {
	children: ReactNode
}

const socket = socketClient('http://localhost:3001/game', {
	autoConnect: false,
	// reconnectionAttempts: 2,
	reconnectionDelay: 2000,
})

export const GameContext = createContext({} as GameContextType)

// const matchData: MatchData = {
// 	player1: {
// 		roomID: '',
// 		socketID: '',
// 		userID: '',
// 		status: 'idle',
// 	},
// 	player2: {
// 		roomID: '',
// 		socketID: '',
// 		userID: '',
// 		status: 'idle',
// 	},
// 	court: {
// 		width: 0,
// 		height: 0,
// 	},
// 	paddle1: {
// 		position: {
// 			x: 0,
// 			y: 0,
// 		},
// 		width: 0,
// 		height: 0,
// 	},
// 	paddle2: {
// 		position: {
// 			x: 0,
// 			y: 0,
// 		},
// 		width: 0,
// 		height: 0,
// 	},
// 	ball: {
// 		position: {
// 			x: 0,
// 			y: 0,
// 		},
// 		radius: 0,
// 		speed: {
// 			x: 0,
// 			y: 0,
// 		},
// 		direction: {
// 			x: 1,
// 			y: 1,
// 		},
// 	},
// 	score: {
// 		p1: 0,
// 		p2: 0,
// 	},
// 	status: 'play',
// }

export function GameProvider({ children }: GameProviderProps) {
	const [state, dispatch] = useReducer(GameReducer, {
		status: 'connected',
		match: {},
	})

	const { status, match } = state

	const router = useRouter()

	useEffect(() => {
		socket.on('status_changed', (status) => {
			dispatch(statusChange(status))
			router.push('/')
		})
		socket.on('match_updated', (match: MatchData) => {
			dispatch(matchUpdate(match))
		})
		socket.on('end_match', (result: any) => {
			console.log('end_match: ', result)
		})
		socket.open()
	}, [router])

	let lastType: string

	function sendKey(type: string, key: string) {
		if (lastType === type) {
			return
		}
		lastType = type
		socket.emit('send_key', { type, key })
	}

	function joinQueue(userID: string) {
		socket.emit('join_queue', JSON.stringify({ userID }))
	}

	function playing() {
		socket.emit('playing', '')
	}

	function exitQueue() {
		socket.emit('exit_queue', '')
	}
	return (
		<GameContext.Provider
			value={{ status, match, sendKey, joinQueue, exitQueue, playing }}
		>
			{children}
		</GameContext.Provider>
	)
}
