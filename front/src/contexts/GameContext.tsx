import {
	clearMatch,
	endMatch,
	matchUpdate,
	requestGame,
	statusChange,
	updateCourtColor,
	updateDimensions,
} from '@/reducers/Game/Action'
import { GameReducer } from '@/reducers/Game/Reducer'
import { MatchData, MatchResult, RequestGame } from '@/reducers/Game/Types'
import { useRouter } from 'next/router'
import {
	MutableRefObject,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useReducer,
	useRef,
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
	containerWidth: number
	containerHeight: number
	courtColor: string
	PageContainerRef: MutableRefObject<null>
	sendKey: (type: string, key: string) => void
	joinQueue: () => void
	exitQueue: () => void
	playing: () => void
	resume: () => void
	giveUp: () => void
	requestMatch: (guestID: number | undefined) => void
	answerRequestMatch: (response: 'accept' | 'refused') => void
	cancelRequestMatch: () => void
	resetGameRequest: () => void
	clearMatchCompleted: () => void
	handleUpdateDimensions: (dimensions: number[]) => void
	handleChangeColor: (color: string) => void
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
		containerWidth: 0,
		containerHeight: 0,
		courtColor: '$blue100',
	})

	const { user } = useContext(UserContext)
	const { getFriends } = useContext(ChatContext)

	const PageContainerRef = useRef(null)

	const {
		status,
		match,
		matchResult,
		isMatchCompleted,
		gameRequest,
		containerWidth,
		containerHeight,
		courtColor,
	} = state

	const router = useRouter()

	function handleErrors(err: any) {
		toast(err.toString(), {
			type: 'error',
			toastId: err.toString(),
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
		socket.on('request_game', (request: RequestGame) => {
			dispatch(requestGame(request))
		})
		socket.on('end_match', (matchResult: MatchResult) => {
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

	function giveUp() {
		emitSocketIfUserIsNotExpired('give_up', '')
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

	function cancelRequestMatch() {
		emitSocketIfUserIsNotExpired('cancel_request_match', { type: 'abort' })
	}

	function exitQueue() {
		emitSocketIfUserIsNotExpired('exit_queue', '')
	}

	function clearMatchCompleted() {
		dispatch(clearMatch())
	}

	function handleUpdateDimensions(dimensions: number[]) {
		dispatch(updateDimensions(dimensions))
	}

	function handleChangeColor(color: string) {
		dispatch(updateCourtColor(color))
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
				containerWidth,
				containerHeight,
				courtColor,
				isMatchCompleted,
				sendKey,
				joinQueue,
				exitQueue,
				playing,
				resume,
				giveUp,
				requestMatch,
				gameRequest,
				answerRequestMatch,
				cancelRequestMatch,
				resetGameRequest,
				clearMatchCompleted,
				handleUpdateDimensions,
				handleChangeColor,
				closeGameSocket,
				PageContainerRef,
			}}
		>
			{children}
		</GameContext.Provider>
	)
}
