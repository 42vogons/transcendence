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

import userDefaulAvatar from '../../public/assets/user.png'
import { ChangeEvent, useEffect, useState } from 'react'
import Loading from './loading'
import { api } from '@/services/api'
import { toast } from 'react-toastify'

export interface iUser {
	user_id: number
	avatar_url: string
	username: string
}

interface iUserInputProps {
	selectedUser: iUser | undefined
	setSelectedUser: (user: iUser | undefined) => void
}

export default function UserInput({
	selectedUser,
	setSelectedUser,
}: iUserInputProps) {
	const [userInput, setUserInput] = useState('')
	const [options, setOptions] = useState<iUser[]>([])
	const [isOptionsLoading, setIsOptionsLoading] = useState(false)

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setSelectedUser(undefined)
		setUserInput(e.target.value)
	}

	function handleSelect(user: iUser) {
		setUserInput(user.username)
		setSelectedUser(user)
	}

	useEffect(() => {
		if (userInput) {
			const findUsersByPartOfUsername = async () => {
				try {
					setIsOptionsLoading(true)
					const { data } = await api.post(
						'/users/findUsersByPartOfUserName',
						{
							user_name: userInput,
						},
					)
					data ? setOptions(data) : setOptions([])
					setIsOptionsLoading(false)
				} catch (error: any) {
					setIsOptionsLoading(false)
					console.log('error:', error)
					toast(error.message ? error.message : error, {
						type: 'error',
					})
				}
			}
			findUsersByPartOfUsername()
		}
	}, [userInput])

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
