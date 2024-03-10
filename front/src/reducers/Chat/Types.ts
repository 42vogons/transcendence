export interface iUser {
	userID: number
	username: string
	expiresAt: Date
}

export interface iChannel {
	channel_id: number
	name: string
	owner_id: number
	type: 'direct' | 'public' | 'protected' | 'private'
}

export interface iChannelMember {
	blocked: boolean
	channel_id: number
	status: string
	user_id: number
	users: {
		action: string[]
		user_id: number
		username: string
		avatar_url: string
	}
}

export interface iChannelMessage {
	channel_id: number
	content: string
	message_id: number
	sender_id: number
	timestamp: Date
	username: string
}

export interface iChannelData {
	channel: iChannel
	channelMembers: iChannelMember[]
	msgs: iChannelMessage[]
}

export interface iLastChannelMessage {
	channelId: number
	channelName: string
	channelMembers: iChannelMember[]
	lastMessage: string
	timestamp: Date
	type: 'direct' | 'public' | 'protected' | 'private'
	userName: string
	user_id: number
}
