// constants.ts
export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
  DIRECT = 'direct',
}

export enum ChannelMemberStatus {
  ADMIN = 'admin',
  MEMBER = 'member',
  OWNER = 'owner',
}

export enum AdminActionType {
  MUTED = 'mute',
  BANNED = 'ban',
  KICKED = 'kick',
}
