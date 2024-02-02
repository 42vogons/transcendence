import { iUser } from './Types'

export enum ActionTypes {
	LOGIN = 'LOGIN',
	UPDATE_USER = 'UPDATE_USER',
	LOGOUT = 'LOGOUT',
}

export function login(user: iUser | undefined) {
	return {
		type: ActionTypes.LOGIN,
		payload: {
			user,
		},
	}
}

export function updateUser() {
	return {
		type: ActionTypes.UPDATE_USER,
	}
}

export function logout() {
	return {
		type: ActionTypes.LOGOUT,
	}
}
