import {
	clearMatch,
	endMatch,
	matchUpdate,
	statusChange,
} from '@/reducers/Game/Action'
import { GameReducer } from '@/reducers/Game/Reducer'
import { MatchData, MatchResult } from '@/reducers/Game/Types'
import { useRouter } from 'next/router'
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react'
import { toast } from 'react-toastify'
import socketClient from 'socket.io-client'
import { UserContext } from './UserContext'
import { isDateExpired } from '@/reducers/User/Reducer'

interface GameContextType {
	status: string
	match: MatchData
	matchResult: MatchResult
	isMatchCompleted: boolean
	sendKey: (type: string, key: string) => void
	joinQueue: () => void
	exitQueue: () => void
	playing: () => void
	resume: () => void
	clearMatchCompleted: () => void
	closeSocket: () => void
}

interface GameProviderProps {
	children: ReactNode
}

const socket = socketClient('http://localhost:3001/game', {
	autoConnect: false,
	reconnectionAttempts: 2,
	reconnectionDelay: 5000,
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

	const { user } = useContext(UserContext)

	const { status, match, matchResult, isMatchCompleted } = state

	const router = useRouter()

	function handleErrors(err: any) {
		console.log('error:', err)
		toast(err.toString(), {
			type: 'error',
		})
	}

	useEffect(() => {
		console.log('user game:', user)
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
		socket.on('exception', () => handleErrors("Something went wrong"))
		if (user && !isDateExpired(user?.expiresAt as Date)) {
			socket.open()
		}
	}, [router, user])

	function emitSocketIfUserIsNotExpired(ev: string, ...args: any[]) {
		if (user && !isDateExpired(user?.expiresAt as Date)) {
			socket.emit(ev, ...args)
		} else {
			socket.close()
			localStorage.removeItem('@42Transcendence:user')
			toast('Your session is expired', {
				type: 'error',
			})
			router.push('/login')
		}
	}

	let lastType: string

	function sendKey(type: string, key: string) {
		if (lastType === type) {
			return
		}
		lastType = type
		if (key === 'p' || key === 'P') {
			emitSocketIfUserIsNotExpired('pause', { type })
			return
		}
		emitSocketIfUserIsNotExpired('send_key', { type, key })
	}

	function joinQueue() {
		emitSocketIfUserIsNotExpired('join_queue', '')
	}

	function playing() {
		emitSocketIfUserIsNotExpired('playing', '')
	}

	function resume() {
		emitSocketIfUserIsNotExpired('resume', '')
	}

	function exitQueue() {
		emitSocketIfUserIsNotExpired('exit_queue', '')
	}

	function clearMatchCompleted() {
		dispatch(clearMatch())
	}

	function closeSocket() {
		socket.close()
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
				resume,
				clearMatchCompleted,
				closeSocket,
			}}
		>
			{children}
		</GameContext.Provider>
	)
}
