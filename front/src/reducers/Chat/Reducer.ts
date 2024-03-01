import { ActionTypes } from './Action'
import { iChannelData, iLastChannelMessage } from './Types'

export interface FriendListItem {
	userID?: number
	userAvatarSrc: string
	username: string
	userStatus: 'online' | 'offline' | 'playing'
}

export interface ChatState {
	friendList: FriendListItem[]
	activeChannelData: iChannelData | undefined
	channelList: iLastChannelMessage[]
}

export function ChatReducer(state: ChatState, action: any) {
	console.log('chat action:', action)
	console.log('chat state:', state)

	switch (action.type) {
		case ActionTypes.UPDATE_FRIEND_LIST: {
			const newState = {
				...state,
				friendList: action.payload.friendList,
			}
			return newState
		}
		case ActionTypes.UPDATE_CHANNEL: {
			const newState = {
				...state,
				activeChannelData: action.payload.activeChannelData,
			}
			return newState
		}
		case ActionTypes.UPDATE_CHANNEL_LIST: {
			const newState = {
				...state,
				channelList: action.payload.channelList,
			}
			return newState
		}
		default:
			return state
	}
}
