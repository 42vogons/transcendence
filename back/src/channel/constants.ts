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
}

export enum AdminActionType {
  MUTED = 'muted',
  BANNED = 'banned',
  KICKED = 'kicked',
}
