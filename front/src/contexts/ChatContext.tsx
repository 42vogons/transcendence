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
	addFriend: (userID: number) => void
	removeFriend: (userID: number) => void
	createDirectChat: (userID: number) => void
	closeChatSocket: () => void
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
		toast(err.message ? err.message : err, {
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
		socket.on('exception', (err) => handleErrors(err))
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

	function addFriend(userID: number) {
		emitSocketIfUserIsNotExpired('add_friend', { member_id: userID })
	}

	function removeFriend(userID: number) {
		console.log('removeFriend:', userID)
		emitSocketIfUserIsNotExpired('remove_friend', { member_id: userID })
	}

	function createDirectChat(userID: number) {
		console.log('createDirectChat:', userID)
		emitSocketIfUserIsNotExpired('create_direct', {
			member_id: userID,
			type: 'direct',
		})
	}

	function closeChatSocket() {
		socket.close()
	}

	return (
		<ChatContext.Provider
			value={{
				friendList,
				addFriend,
				removeFriend,
				createDirectChat,
				closeChatSocket,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}
