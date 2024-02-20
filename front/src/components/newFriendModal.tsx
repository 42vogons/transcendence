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

	function handleAddNewFriend() {
		console.log('new Friend', userInput)
		// addFriend(Number(userInput))
		setShowNewFriendModal(false)
	}

	useEffect(() => {
		// if (userInput) {
		const findUsersByPartOfUsername = async () => {
			try {
				const { data } = await api.post(
					'/users/findUsersByPartOfUserName',
					{
						user_name: userInput,
					},
				)
				console.log('options:', data)
				data ? setOptions(data) : setOptions([])
			} catch (error: any) {
				console.log('error:', error)
				toast(error.message ? error.message : error, {
					type: 'error',
				})
			}
		}
		findUsersByPartOfUsername()
		// }
	}, [userInput])
	return (
		<Modal isOpen={showNewFriendModal}>
			<NewFriendModalContainer>
				<h2>New Friend</h2>
				<UserInput
					userInput={userInput}
					setUserInput={setUserInput}
					options={options}
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
					<Button buttonType="accept" onClick={handleAddNewFriend}>
						<FaUserPlus size={40} />
						Add
					</Button>
				</div>
			</NewFriendModalContainer>
		</Modal>
	)
}
