import { MatchData } from './Types'

export enum ActionTypes {
	STATUS_CHANGE = 'STATUS_CHANGE',
	MATCH_UPDATE = 'MATCH_UPDATE',
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
