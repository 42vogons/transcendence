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
import { ChatReducer, FriendListItem } from '@/reducers/Chat/Reducer'
import { updateFriendList } from '@/reducers/Chat/Action'

interface ChatContextType {
	friendList: FriendListItem[]
}

interface ChatProviderProps {
	children: ReactNode
}

const socket = socketClient('http://localhost:3001/chat', {
	autoConnect: false,
	reconnectionAttempts: 2,
	reconnectionDelay: 5000,
	withCredentials: true,
})

export const ChatContext = createContext({} as ChatContextType)

export function ChatProvider({ children }: ChatProviderProps) {
	const [state, dispatch] = useReducer(ChatReducer, {
		friendList: [],
	})

	const { user } = useContext(UserContext)

	const { friendList } = state

	const router = useRouter()

	function handleErrors(err: any) {
		console.log('error:', err)
		toast(err.toString(), {
			type: 'error',
		})
	}

	useEffect(() => {
		socket.on('update_friend_list', (friendList) => {
			dispatch(updateFriendList(friendList))
		})

		socket.on('refresh_list', () => {
			getFriends()
		})
		socket.on('connect_error', (err) => handleErrors(err))
		socket.on('connect_failed', (err) => handleErrors(err))
		socket.on('exception', () => handleErrors('Something went wrong'))
		if (user && !isDateExpired(user?.expiresAt as Date)) {
			socket.open()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	function getFriends() {
		emitSocketIfUserIsNotExpired('get_friends', '')
	}

	function closeSocket() {
		socket.close()
	}

	return (
		<ChatContext.Provider
			value={{
				friendList,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}
