import {
	FriendAvatarContainer,
	FriendInfoContainer,
	FriendListItemContainer,
	FriendName,
} from '@/styles/components/friendListItem'
import Image from 'next/image'

import userDefaulAvatar from 'public/assets/user.png'

export interface iFriendListItem {
	userAvatarSrc: string
	username: string
	userStatus: 'online' | 'offline' | 'ingame'
}

export function FriendListItem({
	userAvatarSrc,
	username,
	userStatus,
}: iFriendListItem) {
	return (
		<FriendListItemContainer>
			<FriendAvatarContainer status={userStatus} title={userStatus}>
				<Image
					src={userAvatarSrc || userDefaulAvatar.src}
					width={50}
					height={50}
					priority={true}
					alt="user"
				/>
				{userStatus !== 'offline' && (
					<div className="statusIndicator" />
				)}
			</FriendAvatarContainer>

			<FriendInfoContainer>
				<FriendName status={userStatus}>{username}</FriendName>
			</FriendInfoContainer>
		</FriendListItemContainer>
	)
}
