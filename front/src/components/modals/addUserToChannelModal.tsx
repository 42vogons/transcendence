import { useContext, useEffect, useState } from 'react'
import Modal from './modal'
import UserInput, { iUser } from '../UserInput'
import Button from '../button'
import { MdClose } from 'react-icons/md'
import { FaUserPlus } from 'react-icons/fa6'
import { AddUserToChannelModalContainer } from '@/styles/components/addUserToChannelModal'
import { ChatContext } from '@/contexts/ChatContext'

interface iAddUserToChannelModal {
	showAddUserToChannelModal: boolean
	setShowAddUserToChannelModal: (state: boolean) => void
}
export default function AddUserToChannelModal({
	showAddUserToChannelModal,
	setShowAddUserToChannelModal,
}: iAddUserToChannelModal) {
	const [selectedUser, setSelectedUser] = useState<iUser>()

	const { createDirectChat } = useContext(ChatContext)

	function handleCreateAddUserToChannel() {
		if (selectedUser) {
			console.log('add to channel selectedUser:', selectedUser)
			// createDirectChat(selectedUser.user_id)
		}
		setShowAddUserToChannelModal(false)
	}

	useEffect(() => {
		if (!showAddUserToChannelModal) {
			setSelectedUser(undefined)
		}
	}, [showAddUserToChannelModal])

	return (
		<Modal isOpen={showAddUserToChannelModal}>
			<AddUserToChannelModalContainer>
				<h2>Add a new member</h2>
				<UserInput
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
				/>
				<div className="buttonsContainer">
					<Button
						buttonType="cancel"
						onClick={() => {
							console.log('close')
							setShowAddUserToChannelModal(false)
						}}
					>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button
						buttonType="accept"
						onClick={handleCreateAddUserToChannel}
						disabled={!selectedUser}
					>
						<FaUserPlus size={40} />
						Create
					</Button>
				</div>
			</AddUserToChannelModalContainer>
		</Modal>
	)
}
