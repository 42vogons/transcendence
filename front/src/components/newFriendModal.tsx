import { useContext, useState } from 'react'
import Modal from './modal'
import UserInput from './UserInput'
import Button from './button'
import { MdClose } from 'react-icons/md'
import { FaUserPlus } from 'react-icons/fa6'
import { NewFriendModalContainer } from '@/styles/components/newFriendModal'
import { ChatContext } from '@/contexts/ChatContext'

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
	function handleAddNewFriend() {
		console.log('new Friend', userInput)
		addFriend(Number(userInput))
		setShowNewFriendModal(false)
	}
	return (
		<Modal isOpen={showNewFriendModal}>
			<NewFriendModalContainer>
				<h2>New Friend</h2>
				<UserInput userInput={userInput} setUserInput={setUserInput} />
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
