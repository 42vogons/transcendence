import { FriendListItem } from './Reducer'
import { iChannelData } from './Types'

export enum ActionTypes {
	UPDATE_FRIEND_LIST = 'UPDATE_FRIEND_LIST',
	UPDATE_CHANNEL = 'UPDATE_CHANNEL',
}

export function updateFriendList(friendList: FriendListItem[]) {
	return {
		type: ActionTypes.UPDATE_FRIEND_LIST,
		payload: {
			friendList,
		},
	}
}

export function updateChannel(activeChannelData: iChannelData) {
	return {
		type: ActionTypes.UPDATE_CHANNEL,
		payload: {
			activeChannelData,
		},
	}
}
