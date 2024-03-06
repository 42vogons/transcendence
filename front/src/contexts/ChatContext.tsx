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
	updateActiveChannel,
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
import privateDefaulAvatar from '../../public/assets/private.png'
import protectedDefaulAvatar from '../../public/assets/protected.png'
import publicDefaulAvatar from '../../public/assets/public.png'
import { delayMs } from '@/utils/delay'

interface ChatContextType {
	friendList: FriendListItem[]
	activeChannel: number | undefined
	activeChannelData: iChannelData | undefined
	channelList: iLastChannelMessage[]
	addFriend: (userID: number) => void
	removeFriend: (userID: number) => void
	getFriends: () => void
	createDirectChat: (userID: number) => void
	getChannelMessages: (channel_id: number) => void
	sendMessageToChannel: (channel_id: number, content: string) => void
	getChannelList: () => void
	addMemberToChannel: (member_id: number, channel_id: number) => void
	leaveChannel: (channel_id: number) => Promise<void>
	getUsernameFromChannelMembers: (userID: number) => string
	setActiveChannel: (channel_id: number) => void
	getActiveChannelName: (
		channelName: string,
		channelType: 'direct' | 'public' | 'protected' | 'private',
		channelMembers: iChannelMember[],
	) => string
	getActiveChannelAvatar: (
		channelType: 'direct' | 'public' | 'protected' | 'private',
		channelMembers: iChannelMember[],
	) => string
	hasPriveleges: (userID: number, allowedRoles: string[]) => boolean
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
		activeChannel: undefined,
	})

	const { user } = useContext(UserContext)

	const { friendList, activeChannelData, channelList, activeChannel } = state

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

		socket.on('left_the_channel', () => {
			toast('You left the channel.', {
				type: 'info',
			})
			getChannelList()
			dispatch(updateChannel(undefined))
			router.push('/chat')
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
		if (typeof user === 'undefined') {
			/* empty */
		} else if (user && !isDateExpired(user?.expiresAt as Date)) {
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

	async function setActiveChannel(channel_id: number) {
		let value
		if (isNaN(channel_id)) {
			value = undefined
		} else {
			value = channel_id
		}
		await dispatch(updateActiveChannel(value))
		if (value) {
			getChannelMessages(Number(value))
		}
	}

	function getChannelMessages(channel_id: number) {
		// console.log('channel_id::', channel_id)
		// console.log('activeChannel:', activeChannel)
		if (activeChannel && activeChannel === channel_id)
			emitSocketIfUserIsNotExpired('get_channel_msg', {
				channel_id,
			})
	}

	function sendMessageToChannel(channel_id: number, content: string) {
		emitSocketIfUserIsNotExpired('msg_to_server', {
			channel_id,
			content,
		})

		getChannelMessages(channel_id)
	}

	function getChannelList() {
		emitSocketIfUserIsNotExpired('update_channel_list', '')
	}

	function addMemberToChannel(member_id: number, channel_id: number) {
		const status = 'member'
		console.log('addMemmberToChannel:', member_id, channel_id, status)
		emitSocketIfUserIsNotExpired('add_member', {
			member_id,
			channel_id,
			status,
		})
	}

	async function leaveChannel(channel_id: number) {
		emitSocketIfUserIsNotExpired('leave_channel', {
			channel_id,
		})
		console.log('leaveChannel:', channel_id)
		await delayMs(500)
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
		} else if (channelType === 'protected') {
			return protectedDefaulAvatar.src
		} else if (channelType === 'private') {
			return privateDefaulAvatar.src
		} else {
			return publicDefaulAvatar.src
		}
	}

	function hasPriveleges(userID: number, allowedRoles: string[]) {
		const member = (activeChannelData as iChannelData).channelMembers.find(
			(member) => member.user_id === userID,
		)
		return (
			!!member && !!member.status && allowedRoles.includes(member?.status)
		)
	}

	function closeChatSocket() {
		socket.close()
	}

	useEffect(() => {
		if (activeChannel) {
			getChannelMessages(activeChannel)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeChannel])

	return (
		<ChatContext.Provider
			value={{
				friendList,
				channelList,
				activeChannel,
				activeChannelData,
				addFriend,
				removeFriend,
				getFriends,
				createDirectChat,
				closeChatSocket,
				getChannelMessages,
				sendMessageToChannel,
				getChannelList,
				addMemberToChannel,
				leaveChannel,
				getUsernameFromChannelMembers,
				getActiveChannelName,
				getActiveChannelAvatar,
				setActiveChannel,
				hasPriveleges,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}
