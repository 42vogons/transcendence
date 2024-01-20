import { statusChange } from '@/reducers/Game/Action'
import { GameReducer } from '@/reducers/Game/Reducer'
import { useRouter } from 'next/router'
import { ReactNode, createContext, useEffect, useReducer } from 'react'
import socketClient from 'socket.io-client'

interface GameContextType {
	status: string
	joinQueue: (userID: string) => void
	exitQueue: () => void
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
		status: 'connected',
	})

	const { status } = state

	const router = useRouter()

	useEffect(() => {
		socket.on('status_changed', (status) => {
			dispatch(statusChange(status))
			router.push('/')
		})
		socket.open()
	}, [router])

	function joinQueue(userID: string) {
		socket.emit('join_queue', JSON.stringify({ userID }))
	}

	function exitQueue() {
		socket.emit('exit_queue', '')
	}
	return (
		<GameContext.Provider value={{ status, joinQueue, exitQueue }}>
			{children}
		</GameContext.Provider>
	)
}
