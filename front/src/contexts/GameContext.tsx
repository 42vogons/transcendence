import { connected, matchFound } from '@/reducers/Game/Action'
import { GameReducer } from '@/reducers/Game/Reducer'
import { useRouter } from 'next/router'
import { ReactNode, createContext, useEffect, useReducer } from 'react'
import socketClient from 'socket.io-client'

interface GameContextType {
	status: string
	joinQueue: (userID: string) => void
}

interface GameProviderProps {
	children: ReactNode
}

const socket = socketClient('http://localhost:3001/game', {
	autoConnect: false,
})

export const GameContext = createContext({} as GameContextType)

export function GameProvider({ children }: GameProviderProps) {
	const [state, dispatch] = useReducer(GameReducer, {
		status: 'initial',
	})

	const { status } = state

	const router = useRouter()

	useEffect(() => {
		socket.on('connected', () => {
			dispatch(connected())
		})
		socket.on('match_found', (status) => {
			dispatch(matchFound(status))
			router.push('/')
		})
		socket.open()
	}, [])

	function joinQueue(userID: string) {
		socket.emit('join_queue', JSON.stringify({ userID }))
	}
	return (
		<GameContext.Provider value={{ status, joinQueue }}>
			{children}
		</GameContext.Provider>
	)
}
