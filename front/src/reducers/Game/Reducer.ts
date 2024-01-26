import { ActionTypes } from './Action'
import { MatchData } from './Types'

interface GameState {
	status: string
	match: MatchData
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
		case ActionTypes.MATCH_UPDATE: {
			const newState = {
				...state,
				match: action.payload.match,
			}
			return newState
		}
		default:
			return state
	}
}
