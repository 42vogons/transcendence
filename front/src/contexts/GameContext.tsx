import {
	clearMatch,
	endMatch,
	matchUpdate,
	requestGame,
	statusChange,
} from '@/reducers/Game/Action'
import { GameReducer } from '@/reducers/Game/Reducer'
import { MatchData, MatchResult, RequestGame } from '@/reducers/Game/Types'
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
import { ChatContext } from './ChatContext'

interface GameContextType {
	status: string
	match: MatchData
	matchResult: MatchResult
	isMatchCompleted: boolean
	gameRequest: RequestGame
	sendKey: (type: string, key: string) => void
	joinQueue: () => void
	exitQueue: () => void
	playing: () => void
	resume: () => void
	requestMatch: (guestID: number | undefined) => void
	answerRequestMatch: (response: 'accept' | 'refused') => void
	resetGameRequest: () => void
	clearMatchCompleted: () => void
	closeGameSocket: () => void
}

interface GameProviderProps {
	children: ReactNode
}

const socket = socketClient(`${process.env.NEXT_PUBLIC_BACK_HOST}/game`, {
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
		gameRequest: {} as RequestGame,
	})

	const { user } = useContext(UserContext)
	const { getFriends } = useContext(ChatContext)

	const { status, match, matchResult, isMatchCompleted, gameRequest } = state

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
		socket.on('request_game', (request: RequestGame) => {
			dispatch(requestGame(request))
		})
		socket.on('end_match', (matchResult: MatchResult) => {
			console.log('end_match: ', matchResult)
			dispatch(endMatch(matchResult))
		})
		socket.on('refresh_list', () => {
			getFriends()
		})
		socket.on('request_game_error', (err) => handleErrors(err))
		socket.on('connect_error', (err) => handleErrors(err))
		socket.on('connect_failed', (err) => handleErrors(err))
		socket.on('exception', () => handleErrors('Something went wrong'))
		if (user && !isDateExpired(user?.expiresAt as Date)) {
			socket.open()
		}

		return () => {
			socket.close()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	useEffect(() => {
		if (
			!isMatchCompleted &&
			status === 'playing' &&
			match.status === 'pause'
		) {
			toast('The game is paused.', { type: 'info' })
		}
		return () => {
			if (
				!isMatchCompleted &&
				status === 'playing' &&
				match.status === 'pause'
			) {
				toast('The game restarted.', { type: 'success' })
			}
		}
	}, [status, isMatchCompleted, match?.status])

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

	function requestMatch(guestID: number | undefined) {
		emitSocketIfUserIsNotExpired('request_match', { guestID })
	}

	function resetGameRequest() {
		const request = undefined
		dispatch(requestGame(request))
	}

	function answerRequestMatch(response: 'accept' | 'refused') {
		resetGameRequest()
		emitSocketIfUserIsNotExpired('response_resquest_match', {
			response,
		})
	}

	function exitQueue() {
		emitSocketIfUserIsNotExpired('exit_queue', '')
	}

	function clearMatchCompleted() {
		dispatch(clearMatch())
	}

	function closeGameSocket() {
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
				requestMatch,
				gameRequest,
				answerRequestMatch,
				resetGameRequest,
				clearMatchCompleted,
				closeGameSocket,
			}}
		>
			{children}
		</GameContext.Provider>
	)
}
