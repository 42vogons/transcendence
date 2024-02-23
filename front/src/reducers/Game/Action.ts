import { MatchData, MatchResult, RequestGame } from './Types'

export enum ActionTypes {
	STATUS_CHANGE = 'STATUS_CHANGE',
	MATCH_UPDATE = 'MATCH_UPDATE',
	REQUEST_GAME = 'REQUEST_GAME',
	END_MATCH = 'END_MATCH',
	CLEAR_MATCH = 'CLEAR_MATCH',
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
