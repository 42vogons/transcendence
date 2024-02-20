import {
	LoadingContainer,
	UserAvatarContainer,
	UserInputContainer,
	UserList,
	UserListItem,
	Username,
} from '@/styles/components/UserInput'
import Image from 'next/image'
import { FaUserAstronaut } from 'react-icons/fa6'

import userDefaulAvatar from 'public/assets/user.png'
import { ChangeEvent } from 'react'
import Loading from './loading'

export interface iUser {
	user_id: number
	avatar_url: string
	username: string
}

interface iUserInputProps {
	userInput: string
	setUserInput: (value: string) => void
	options: iUser[]
	isOptionsLoading: boolean
	selectedUser: iUser | undefined
	setSelectedUser: (user: iUser | undefined) => void
}

export default function UserInput({
	userInput,
	setUserInput,
	options,
	selectedUser,
	setSelectedUser,
	isOptionsLoading,
}: iUserInputProps) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setSelectedUser(undefined)
		setUserInput(e.target.value)
	}

	function handleSelect(user: iUser) {
		console.log('user.user_id:', user.username)
		setUserInput(user.username)
		setSelectedUser(user)
	}

	return (
		<UserInputContainer
			hasOption={!selectedUser && userInput !== '' && options.length > 0}
		>
			{!selectedUser ? (
				<FaUserAstronaut className="icon" size={32} />
			) : (
				<UserAvatarContainer className="icon">
					<Image
						src={selectedUser.avatar_url || userDefaulAvatar.src}
						width={32}
						height={32}
						// priority={true}
						alt="user"
					/>
				</UserAvatarContainer>
			)}
			<input
				id="userInput"
				type="string"
				maxLength={8}
				placeholder="Username"
				onChange={(e) => handleChange(e)}
				value={userInput}
			/>
			{!selectedUser && isOptionsLoading && (
				<UserList>
					<LoadingContainer>
						<Loading size={38} />
						Loading...
					</LoadingContainer>
				</UserList>
			)}
			{!selectedUser &&
				!isOptionsLoading &&
				userInput !== '' &&
				options.length > 0 && (
					<UserList>
						{options.map((user: iUser) => (
							<UserListItem
								key={user.user_id}
								onClick={() => handleSelect(user)}
							>
								<UserAvatarContainer>
									<Image
										src={
											user.avatar_url ||
											userDefaulAvatar.src
										}
										width={32}
										height={32}
										// priority={true}
										alt="user"
									/>
								</UserAvatarContainer>
								<Username>{user.username}</Username>
							</UserListItem>
						))}
					</UserList>
				)}
		</UserInputContainer>
	)
}
