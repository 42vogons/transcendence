import { FriendListItem } from './Reducer'

export enum ActionTypes {
	UPDATE_FRIEND_LIST = 'UPDATE_FRIEND_LIST',
}

export function updateFriendList(friendList: FriendListItem[]) {
	return {
		type: ActionTypes.UPDATE_FRIEND_LIST,
		payload: {
			friendList,
		},
	}
}
