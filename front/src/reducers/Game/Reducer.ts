import { ActionTypes } from './Action'
import { MatchData, MatchResult } from './Types'

interface GameState {
	status: string
	match: MatchData
	matchResult: MatchResult
	isMatchCompleted: boolean
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
		case ActionTypes.END_MATCH: {
			const newState = {
				...state,
				match: {} as MatchData,
				matchResult: action.payload.matchResult,
				isMatchCompleted: true,
			}
			return newState
		}
		case ActionTypes.CLEAR_MATCH: {
			const newState = {
				...state,
				matchResult: {} as MatchResult,
				isMatchCompleted: false,
			}
			return newState
		}
		default:
			return state
	}
}
