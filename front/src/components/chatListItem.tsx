import {
	ChatAvatarContainer,
	ChatInfoContainer,
	ChatLastMessage,
	ChatListItemContainer,
	ChatName,
} from '@/styles/components/chatListItem'
import Image from 'next/image'
import { FaUserAstronaut } from 'react-icons/fa6'

export interface iChatListItem {
	avatarSrc: string
	name: string
	lastUsername: string
	lastMessage: string
	channelType: 'direct' | 'public' | 'protected' | 'private'
	isActive?: boolean
	handleOnClick?: () => Promise<boolean> | undefined
}

export function ChatListItem({
	avatarSrc,
	name,
	lastUsername,
	lastMessage,
	channelType,
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
					src={avatarSrc}
					width={50}
					height={50}
					priority={true}
					alt="user"
				/>
			</ChatAvatarContainer>

			<ChatInfoContainer>
				<ChatName type={channelType} title={name}>
					{name}
				</ChatName>
				<ChatLastMessage title={lastMessage} isActive={isActive}>
					<FaUserAstronaut size={12} />
					{` ${lastUsername}: ${lastMessage}`}
				</ChatLastMessage>
			</ChatInfoContainer>
		</ChatListItemContainer>
	)
}
