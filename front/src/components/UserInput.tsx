import {
	UserAvatarContainer,
	UserInputContainer,
	UserList,
	UserListItem,
	Username,
} from '@/styles/components/UserInput'
import Image from 'next/image'
import { FaUserAstronaut } from 'react-icons/fa6'

import userDefaulAvatar from 'public/assets/user.png'

export interface iUser {
	user_id: number
	avatar_url: string
	username: string
}

interface iUserInputProps {
	userInput: string
	setUserInput: (value: string) => void
	options: iUser[]
}

export default function UserInput({
	userInput,
	setUserInput,
	options,
}: iUserInputProps) {
	return (
		<UserInputContainer hasOption={options.length > 0}>
			<FaUserAstronaut className="icon" size={32} />
			<input
				id="userInput"
				type="string"
				maxLength={8}
				onChange={(e) => setUserInput(e.target.value)}
				value={userInput}
			/>
			{options.length > 0 && (
				<UserList>
					{options.map((user: iUser) => (
						<UserListItem key={user.user_id}>
							<UserAvatarContainer>
								<Image
									src={
										user.avatar_url || userDefaulAvatar.src
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
