import { FriendListItem } from './Reducer'
import { iChannelData, iLastChannelMessage } from './Types'

export enum ActionTypes {
	UPDATE_FRIEND_LIST = 'UPDATE_FRIEND_LIST',
	UPDATE_CHANNEL = 'UPDATE_CHANNEL',
	UPDATE_CHANNEL_LIST = 'UPDATE_CHANNEL_LIST',
	UPDATE_ACTIVE_CHANNEL = 'UPDATE_ACTIVE_CHANNEL',
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

export function updateChannelList(channelList: iLastChannelMessage[]) {
	return {
		type: ActionTypes.UPDATE_CHANNEL_LIST,
		payload: {
			channelList,
		},
	}
}

export function updateActiveChannel(activeChannel: number | undefined) {
	return {
		type: ActionTypes.UPDATE_ACTIVE_CHANNEL,
		payload: {
			activeChannel,
		},
	}
}
