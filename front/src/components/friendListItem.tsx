import { FriendListItem as iFriendListItem } from '@/reducers/Chat/Reducer'
import {
	FriendAction,
	FriendAvatarContainer,
	FriendInfoContainer,
	FriendListItemContainer,
	FriendListItemWrapper,
	FriendName,
	MenuArrow,
	MenuContent,
	MenuItem,
} from '@/styles/components/friendListItem'
import Image from 'next/image'

import userDefaulAvatar from 'public/assets/user.png'
import { BsChatSquareTextFill } from 'react-icons/bs'
import { FaGamepad } from 'react-icons/fa6'

export function FriendListItem({
	userAvatarSrc,
	username,
	userStatus,
}: iFriendListItem) {
	const iconSize = 26

	function handleChatOnClick() {
		console.log('chat', username)
	}

	function handleGameOnClick() {
		console.log('game', username)
	}

	return (
		<FriendListItemWrapper>
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

			<MenuContent>
				<MenuArrow />
				<MenuItem>
					<FriendAction onClick={handleGameOnClick}>
						<FaGamepad size={iconSize} /> Play
					</FriendAction>
				</MenuItem>
				<MenuItem>
					<FriendAction onClick={handleChatOnClick}>
						<BsChatSquareTextFill size={iconSize} /> Chat
					</FriendAction>
				</MenuItem>
			</MenuContent>
		</FriendListItemWrapper>
	)
}
