import {
	clearMatch,
	endMatch,
	matchUpdate,
	statusChange,
} from '@/reducers/Game/Action'
import { GameReducer } from '@/reducers/Game/Reducer'
import { MatchData, MatchResult } from '@/reducers/Game/Types'
import { useRouter } from 'next/router'
import { ReactNode, createContext, useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import socketClient from 'socket.io-client'

interface GameContextType {
	status: string
	match: MatchData
	matchResult: MatchResult
	isMatchCompleted: boolean
	sendKey: (type: string, key: string) => void
	joinQueue: (userID: string) => void
	exitQueue: () => void
	playing: () => void
	clearMatchCompleted: () => void
}

interface GameProviderProps {
	children: ReactNode
}

const socket = socketClient('http://localhost:3001/game', {
	autoConnect: false,
	// reconnectionAttempts: 2,
	reconnectionDelay: 2000,
	withCredentials: true,
})

export const GameContext = createContext({} as GameContextType)

export function GameProvider({ children }: GameProviderProps) {
	const [state, dispatch] = useReducer(GameReducer, {
		status: 'connected',
		match: {} as MatchData,
		matchResult: {} as MatchResult,
		isMatchCompleted: false,
	})

	const { status, match, matchResult, isMatchCompleted } = state

	const router = useRouter()

	function handleErrors(err: any) {
		console.log('error:', err)
		toast(err.toString(), {
			type: 'error',
		})
	}

	useEffect(() => {
		socket.on('status_changed', (status) => {
			dispatch(statusChange(status))
			if (status === 'readyToPlay') {
				router.push('/')
			}
		})
		socket.on('match_updated', (match: MatchData) => {
			dispatch(matchUpdate(match))
		})
		socket.on('end_match', (matchResult: MatchResult) => {
			console.log('end_match: ', matchResult)
			dispatch(endMatch(matchResult))
		})
		socket.on('connect_error', (err) => handleErrors(err))
		socket.on('connect_failed', (err) => handleErrors(err))
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

	function clearMatchCompleted() {
		dispatch(clearMatch())
	}

	return (
		<GameContext.Provider
			value={{
				status,
				match,
				matchResult,
				isMatchCompleted,
				sendKey,
				joinQueue,
				exitQueue,
				playing,
				clearMatchCompleted,
			}}
		>
			{children}
		</GameContext.Provider>
	)
}
