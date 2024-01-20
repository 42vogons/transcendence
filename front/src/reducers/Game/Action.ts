export enum ActionTypes {
	CONNECTED = 'CONNECTED',
	JOIN_QUEUE = 'JOIN_QUEUE',
	STATUS_CHANGE = 'STATUS_CHANGE',
}

export function statusChange(status: string) {
	return {
		type: ActionTypes.STATUS_CHANGE,
		payload: {
			status,
		},
	}
}
