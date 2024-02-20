import { useContext, useEffect, useState } from 'react'
import Modal from './modal'
import UserInput, { iUser } from './UserInput'
import Button from './button'
import { MdClose } from 'react-icons/md'
import { FaUserPlus } from 'react-icons/fa6'
import { NewFriendModalContainer } from '@/styles/components/newFriendModal'
import { ChatContext } from '@/contexts/ChatContext'
import { api } from '@/services/api'
import { toast } from 'react-toastify'

interface iNewFriendModal {
	showNewFriendModal: boolean
	setShowNewFriendModal: (state: boolean) => void
}

export default function NewFriendModal({
	showNewFriendModal,
	setShowNewFriendModal,
}: iNewFriendModal) {
	const { addFriend } = useContext(ChatContext)
	const [userInput, setUserInput] = useState('')
	const [options, setOptions] = useState<iUser[]>([])
	const [isOptionsLoading, setIsOptionsLoading] = useState(false)
	const [selectedUser, setSelectedUser] = useState<iUser>()

	function handleAddNewFriend() {
		console.log('new Friend', selectedUser)
		if (selectedUser) {
			addFriend(selectedUser.user_id)
		}
		setSelectedUser(undefined)
		setUserInput('')
		setShowNewFriendModal(false)
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
					console.log('options:', data)
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

	useEffect(() => {
		console.log('selectedUser:', selectedUser)
	}, [selectedUser])

	return (
		<Modal isOpen={showNewFriendModal}>
			<NewFriendModalContainer>
				<h2>New Friend</h2>
				<UserInput
					userInput={userInput}
					setUserInput={setUserInput}
					options={options}
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
					isOptionsLoading={isOptionsLoading}
				/>
				<div className="buttonsContainer">
					<Button
						buttonType="cancel"
						onClick={() => {
							console.log('close')
							setShowNewFriendModal(false)
						}}
					>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button
						buttonType="accept"
						onClick={handleAddNewFriend}
						disabled={!selectedUser}
					>
						<FaUserPlus size={40} />
						Add
					</Button>
				</div>
			</NewFriendModalContainer>
		</Modal>
	)
}
