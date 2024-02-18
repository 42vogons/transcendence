import { useContext, useState } from 'react'
import Modal from './modal'
import UserInput from './UserInput'
import Button from './button'
import { MdClose } from 'react-icons/md'
import { FaUserPlus } from 'react-icons/fa6'
import { NewChatModalContainer } from '@/styles/components/newChatModal'
import { ChatContext } from '@/contexts/ChatContext'

interface iNewChatModal {
	showNewChatModal: boolean
	setShowNewChatModal: (state: boolean) => void
}
export default function NewChatModal({
	showNewChatModal,
	setShowNewChatModal,
}: iNewChatModal) {
	const [userInput, setUserInput] = useState('')

	const { createDirectChat } = useContext(ChatContext)

	function handleCreateNewChat() {
		createDirectChat(Number(userInput))
		setShowNewChatModal(false)
	}
	return (
		<Modal isOpen={showNewChatModal}>
			<NewChatModalContainer>
				<h2>New Chat</h2>
				<UserInput userInput={userInput} setUserInput={setUserInput} />
				<div className="buttonsContainer">
					<Button
						buttonType="cancel"
						onClick={() => {
							console.log('close')
							setShowNewChatModal(false)
						}}
					>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button buttonType="accept" onClick={handleCreateNewChat}>
						<FaUserPlus size={40} />
						Add
					</Button>
				</div>
			</NewChatModalContainer>
		</Modal>
	)
}
