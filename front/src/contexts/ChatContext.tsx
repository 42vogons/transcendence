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
import {
	updateChannel,
	updateChannelList,
	updateFriendList,
} from '@/reducers/Chat/Action'
import {
	iChannelData,
	iChannelMember,
	iLastChannelMessage,
} from '@/reducers/Chat/Types'
import userDefaulAvatar from '../../public/assets/user.png'

interface ChatContextType {
	friendList: FriendListItem[]
	activeChannelData: iChannelData | undefined
	channelList: iLastChannelMessage[]
	addFriend: (userID: number) => void
	removeFriend: (userID: number) => void
	getFriends: () => void
	createDirectChat: (userID: number) => void
	getChannelMessages: (channel_id: number) => void
	sendMessageToChannel: (channel_id: number, content: string) => void
	getUsernameFromChannelMembers: (userID: number) => string
	getActiveChannelName: (
		channelName: string,
		channelType: 'direct' | 'public' | 'protected' | 'private',
		channelMembers: iChannelMember[],
	) => string
	getActiveChannelAvatar: (
		channelType: 'direct' | 'public' | 'protected' | 'private',
		channelMembers: iChannelMember[],
	) => string
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
		activeChannelData: undefined,
		channelList: [],
	})

	const { user } = useContext(UserContext)

	const { friendList, activeChannelData, channelList } = state

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
			getChannelMessages(channelID)
		})

		socket.on('update_channel', (activeChannelData) => {
			console.log('update_channel:', activeChannelData)
			dispatch(updateChannel(activeChannelData))
		})

		socket.on(
			'refresh_channel_list',
			(channelList: iLastChannelMessage[]) => {
				dispatch(updateChannelList(channelList))
			},
		)
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

	function getChannelMessages(channel_id: number) {
		console.log('refreshChat channelID:', channel_id)
		emitSocketIfUserIsNotExpired('get_channel_msg', {
			channel_id,
		})
	}

	function sendMessageToChannel(channel_id: number, content: string) {
		console.log('sendMessageToChannel:', channel_id, content)
		emitSocketIfUserIsNotExpired('msg_to_server', {
			channel_id,
			content,
		})
	}

	function getUsernameFromChannelMembers(userID: number) {
		const member = (activeChannelData as iChannelData)?.channelMembers.find(
			(member) => member.user_id === userID,
		)
		return member ? member.users.username : 'name not found'
	}

	function getTheOtherChannelMember(
		userID: number | undefined,
		channelMembers: iChannelMember[],
	): iChannelMember['users'] | undefined {
		const member = channelMembers.find(
			(member) => member.user_id !== userID,
		)
		return member ? member.users : undefined
	}

	function getActiveChannelName(
		channelName: string,
		channelType: 'direct' | 'public' | 'protected' | 'private',
		channelMembers: iChannelMember[],
	): string {
		if (channelType === 'direct') {
			const userData = getTheOtherChannelMember(
				user?.userID,
				channelMembers,
			)
			if (userData) {
				return userData.username
			} else {
				return channelName
			}
		} else {
			return channelName
		}
	}

	function getActiveChannelAvatar(
		channelType: 'direct' | 'public' | 'protected' | 'private',
		channelMembers: iChannelMember[],
	) {
		if (channelType === 'direct') {
			const userData = getTheOtherChannelMember(
				user?.userID,
				channelMembers,
			)
			if (userData && userData.avatar_url) {
				return userData.avatar_url
			} else {
				return userDefaulAvatar.src
			}
		} else {
			return 'todo'
		}
	}

	function closeChatSocket() {
		socket.close()
	}

	return (
		<ChatContext.Provider
			value={{
				friendList,
				channelList,
				activeChannelData,
				addFriend,
				removeFriend,
				getFriends,
				createDirectChat,
				closeChatSocket,
				getChannelMessages,
				sendMessageToChannel,
				getUsernameFromChannelMembers,
				getActiveChannelName,
				getActiveChannelAvatar,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}
