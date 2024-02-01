import { ActionTypes } from './Action'
import { iUser } from './Types'

interface UserState {
	user: iUser
}

export function UserReducer(state: UserState, action: any) {
	console.log('action user:', action)
	console.log('state user:', state)

	switch (action.type) {
		case ActionTypes.LOGIN: {
			console.log('LOGIN:', action)
			const newState = {
				...state,
				user: action.payload.user,
			}
			localStorage.setItem(
				'@42Transcendence:user',
				JSON.stringify(action.payload.user),
			)
			return newState
		}
		case ActionTypes.UPDATE_USER: {
			const userStr = localStorage.getItem('@42Transcendence:user')
			let newUser
			if (userStr) {
				newUser = JSON.parse(userStr)
			}
			const newState = {
				...state,
				user: newUser,
			}
			return newState
		}
		case ActionTypes.LOGOUT: {
			const newState = {
				...state,
				user: undefined,
			}
			return newState
		}
		default:
			return state
	}
}
