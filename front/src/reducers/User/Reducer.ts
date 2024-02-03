import { ActionTypes } from './Action'
import { iUser } from './Types'

interface UserState {
	user: iUser
}

export function isDateExpired(date: Date) {
	return new Date().getTime() > new Date(date).getTime()
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
			let newUser: iUser | undefined
			if (userStr) {
				newUser = JSON.parse(userStr)
				if (newUser) {
					if (isDateExpired(newUser.expiresAt)) {
						localStorage.removeItem('@42Transcendence:user')
						newUser = undefined
					}
				}
			}
			const newState = {
				...state,
				user: newUser,
			}
			return newState
		}
		case ActionTypes.LOGOUT: {
			localStorage.removeItem('@42Transcendence:user')
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
