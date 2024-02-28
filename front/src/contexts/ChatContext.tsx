/* eslint-disable camelcase */
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
	getChannelMsgs: (channel_id: number) => void
	closeChatSocket: () => void
}

interface ChatProviderProps {
	children: ReactNode
}

const socket = socketClient(`${process.env.NEXT_PUBLIC_BACK_HOST}/chat`, {
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
		socket.on('refresh_chat', (data: { channelID: number }) => {
			console.log('refresh_channel data:', data)
			const { channelID } = data
			console.log('refresh_channel:', channelID)
			getChannelMsgs(channelID)
		})

		socket.on('update_channel', (msgs) => {
			console.log('update_channel:', msgs)
		})

		socket.on('refresh_channel_list', (msgs) => {
			console.log('refresh_channel_list:', msgs)
		})
		socket.on('connect_error', (err) => handleErrors(err))
		socket.on('connect_failed', (err) => handleErrors(err))
		socket.on('exception', (err) => handleErrors(err))
		if (user && !isDateExpired(user?.expiresAt as Date)) {
			socket.open()
		}

		return () => {
			socket.close()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

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

	function getChannelMsgs(channel_id: number) {
		console.log('refreshChat channelID:', channel_id)
		emitSocketIfUserIsNotExpired('get_channel_msg', {
			channel_id,
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
				getChannelMsgs,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}
