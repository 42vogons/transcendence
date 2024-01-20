import { ActionTypes } from './Action'

interface GameState {
	status: string
}

export function GameReducer(state: GameState, action: any) {
	console.log('action:', action)
	console.log('state:', state)

	switch (action.type) {
		case ActionTypes.STATUS_CHANGE: {
			const newState = {
				...state,
				status: action.payload.status,
			}
			return newState
		}
		default:
			return state
	}
}
