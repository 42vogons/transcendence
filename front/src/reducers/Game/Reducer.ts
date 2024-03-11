import { ActionTypes } from './Action'
import { MatchData, MatchResult, RequestGame } from './Types'

interface GameState {
	status: string
	match: MatchData
	matchResult: MatchResult
	isMatchCompleted: boolean
	gameRequest: RequestGame | undefined
	containerWidth: number
	containerHeight: number
}

export function GameReducer(state: GameState, action: any) {
	// console.log('action:', action)
	// console.log('state:', state)

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
		case ActionTypes.REQUEST_GAME: {
			const newState = {
				...state,
				gameRequest: action.payload.request,
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
		case ActionTypes.UPDATE_GAME_CONTAINER_DIMENSIONS: {
			const newState = {
				...state,
				containerWidth: action.payload.dimensions[0],
				containerHeight: action.payload.dimensions[1],
			}
			return newState
		}
		default:
			return state
	}
}
