import { ActionTypes } from './Action'

export interface FriendListItem {
	userID?: number
	userAvatarSrc: string
	username: string
	userStatus: 'online' | 'offline' | 'ingame'
}

export interface ChatState {
	friendList: FriendListItem[]
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
		default:
			return state
	}
}
