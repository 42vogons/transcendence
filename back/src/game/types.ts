export type UserData = {
	socketID: string
	userID: string
	roomID: string
	status: "idle"|"searching"|"readyToPlay"|"playing"
}

export type Room = {
	ID: string
	users: UserData[]
}
