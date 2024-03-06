/* eslint-disable camelcase */
import { useContext, useEffect, useState } from 'react'
import UserInput, { iUser } from '../UserInput'
import Button from '../button'
import { MdClose } from 'react-icons/md'
import { FaUserPlus } from 'react-icons/fa6'
import { AddUserToChannelModalContainer } from '@/styles/components/addUserToChannelModal'
import ModalWithCloseOutside from './modalWithCloseOutside'
import { ChatContext } from '@/contexts/ChatContext'

interface iAddUserToChannelModal {
	showAddUserToChannelModal: boolean
	setShowAddUserToChannelModal: (state: boolean) => void
	channel_id: number
}
export default function AddUserToChannelModal({
	showAddUserToChannelModal,
	setShowAddUserToChannelModal,
	channel_id,
}: iAddUserToChannelModal) {
	const [selectedUser, setSelectedUser] = useState<iUser>()

	const { addMemberToChannel } = useContext(ChatContext)

	function handleCreateAddUserToChannel() {
		if (selectedUser) {
			console.log(
				'add to channel selectedUser:',
				channel_id,
				selectedUser,
			)
			addMemberToChannel(selectedUser.user_id, channel_id)
			setShowAddUserToChannelModal(false)
		}
	}

	useEffect(() => {
		if (!showAddUserToChannelModal) {
			setSelectedUser(undefined)
		}
	}, [showAddUserToChannelModal])

	return (
		<ModalWithCloseOutside
			isOpen={showAddUserToChannelModal}
			setIsOpen={setShowAddUserToChannelModal}
		>
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
						Add
					</Button>
				</div>
			</AddUserToChannelModalContainer>
		</ModalWithCloseOutside>
	)
}
