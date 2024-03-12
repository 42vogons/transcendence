import { MatchData, MatchResult, RequestGame } from './Types'

export enum ActionTypes {
	STATUS_CHANGE = 'STATUS_CHANGE',
	MATCH_UPDATE = 'MATCH_UPDATE',
	REQUEST_GAME = 'REQUEST_GAME',
	END_MATCH = 'END_MATCH',
	CLEAR_MATCH = 'CLEAR_MATCH',
	UPDATE_GAME_CONTAINER_DIMENSIONS = 'UPDATE_GAME_CONTAINER_DIMENSIONS',
	UPDATE_COURT_COLOR = 'UPDATE_COURT_COLOR',
}

export function statusChange(status: string) {
	return {
		type: ActionTypes.STATUS_CHANGE,
		payload: {
			status,
		},
	}
}

export function matchUpdate(match: MatchData) {
	return {
		type: ActionTypes.MATCH_UPDATE,
		payload: {
			match,
		},
	}
}

export function requestGame(request: RequestGame | undefined) {
	return {
		type: ActionTypes.REQUEST_GAME,
		payload: {
			request,
		},
	}
}

export function endMatch(matchResult: MatchResult) {
	return {
		type: ActionTypes.END_MATCH,
		payload: {
			matchResult,
		},
	}
}

export function clearMatch() {
	return {
		type: ActionTypes.CLEAR_MATCH,
	}
}

export function updateDimensions(dimensions: number[]) {
	return {
		type: ActionTypes.UPDATE_GAME_CONTAINER_DIMENSIONS,
		payload: {
			dimensions,
		},
	}
}

export function updateCourtColor(color: string) {
	return {
		type: ActionTypes.UPDATE_COURT_COLOR,
		payload: {
			color,
		},
	}
}
