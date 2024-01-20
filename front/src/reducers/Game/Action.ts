export enum ActionTypes {
	CONNECTED = 'CONNECTED',
	JOIN_QUEUE = 'JOIN_QUEUE',
	MATCH_FOUND = 'MATCH_FOUND',
}

export function connected() {
	return {
		type: ActionTypes.CONNECTED,
		payload: {
			status: 'connected',
		},
	}
}

export function matchFound(status: string) {
	return {
		type: ActionTypes.MATCH_FOUND,
		payload: {
			status,
		},
	}
}
