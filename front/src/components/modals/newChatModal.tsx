import { useContext, useEffect, useState } from 'react'
import UserInput, { iUser } from '../UserInput'
import Button from '../button'
import { MdClose } from 'react-icons/md'
import { FaUserPlus } from 'react-icons/fa6'
import { NewChatModalContainer } from '@/styles/components/newChatModal'
import { ChatContext } from '@/contexts/ChatContext'
import ModalWithCloseOutside from './modalWithCloseOutside'

interface iNewChatModal {
	showNewChatModal: boolean
	setShowNewChatModal: (state: boolean) => void
}
export default function NewChatModal({
	showNewChatModal,
	setShowNewChatModal,
}: iNewChatModal) {
	const [selectedUser, setSelectedUser] = useState<iUser>()

	const { createDirectChat } = useContext(ChatContext)

	function handleCreateNewChat() {
		if (selectedUser) {
			createDirectChat(selectedUser.user_id)
		}
		setShowNewChatModal(false)
	}

	useEffect(() => {
		if (!showNewChatModal) {
			setSelectedUser(undefined)
		}
	}, [showNewChatModal])

	return (
		<ModalWithCloseOutside
			isOpen={showNewChatModal}
			setIsOpen={setShowNewChatModal}
		>
			<NewChatModalContainer>
				<h2>New Chat</h2>
				<UserInput
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
				/>
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
					<Button
						buttonType="accept"
						onClick={handleCreateNewChat}
						disabled={!selectedUser}
					>
						<FaUserPlus size={40} />
						Create
					</Button>
				</div>
			</NewChatModalContainer>
		</ModalWithCloseOutside>
	)
}
