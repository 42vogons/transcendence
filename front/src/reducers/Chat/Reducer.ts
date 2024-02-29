import { ActionTypes } from './Action'
import { iChannelData } from './Types'

export interface FriendListItem {
	userID?: number
	userAvatarSrc: string
	username: string
	userStatus: 'online' | 'offline' | 'ingame'
}

export interface ChatState {
	friendList: FriendListItem[]
	activeChannelData: iChannelData | undefined
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
		default:
			return state
	}
}
