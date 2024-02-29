import {
	ChatAvatarContainer,
	ChatInfoContainer,
	ChatLastMessage,
	ChatListItemContainer,
	ChatName,
} from '@/styles/components/chatListItem'
import Image from 'next/image'

import userDefaulAvatar from '../../public/assets/user.png'

export interface iChatListItem {
	userAvatarSrc: string
	name: string
	lastMessage: string
	isActive?: boolean
	handleOnClick?: () => Promise<boolean> | undefined
}

export function ChatListItem({
	userAvatarSrc,
	name,
	lastMessage,
	isActive,
	handleOnClick,
}: iChatListItem) {
	return (
		<ChatListItemContainer
			onClick={
				handleOnClick
					? () => {
							handleOnClick()
							// console.log('handleOnClick:', handleOnClick)
					  }
					: () => null
			}
			isActive={isActive}
		>
			<ChatAvatarContainer>
				<Image
					src={userAvatarSrc || userDefaulAvatar.src}
					width={50}
					height={50}
					priority={true}
					alt="user"
				/>
			</ChatAvatarContainer>

			<ChatInfoContainer>
				<ChatName>{name}</ChatName>
				<ChatLastMessage title={lastMessage} isActive={isActive}>
					{lastMessage}
				</ChatLastMessage>
			</ChatInfoContainer>
		</ChatListItemContainer>
	)
}
