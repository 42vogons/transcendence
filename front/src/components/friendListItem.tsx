import { ChatContext } from '@/contexts/ChatContext'
import { GameContext } from '@/contexts/GameContext'
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
import { useContext } from 'react'
import { BsChatSquareTextFill } from 'react-icons/bs'
import { FaGamepad, FaUserMinus } from 'react-icons/fa6'

export function FriendListItem({
	userID,
	userAvatarSrc,
	username,
	userStatus,
}: iFriendListItem) {
	const { removeFriend } = useContext(ChatContext)
	const { requestMatch } = useContext(GameContext)

	const iconSize = 26

	function handleChatOnClick() {
		console.log('chat', username)
	}

	function handleGameOnClick() {
		console.log('game', username)
		if (userID) {
			requestMatch(userID)
		}
	}

	function handleRemoveOnClick() {
		removeFriend(Number(userID))
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
				<MenuItem>
					<FriendAction onClick={handleRemoveOnClick}>
						<FaUserMinus size={iconSize} /> Remove
					</FriendAction>
				</MenuItem>
			</MenuContent>
		</FriendListItemWrapper>
	)
}
