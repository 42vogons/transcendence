import { useContext, useEffect, useState } from 'react'
import UserInput, { iUser } from '../UserInput'
import Button from '../button'
import { MdClose } from 'react-icons/md'
import { FaUserPlus } from 'react-icons/fa6'
import { NewFriendModalContainer } from '@/styles/components/newFriendModal'
import { ChatContext } from '@/contexts/ChatContext'
import ModalWithCloseOutside from './modalWithCloseOutside'

interface iNewFriendModal {
	showNewFriendModal: boolean
	setShowNewFriendModal: (state: boolean) => void
}

export default function NewFriendModal({
	showNewFriendModal,
	setShowNewFriendModal,
}: iNewFriendModal) {
	const { addFriend } = useContext(ChatContext)
	const [selectedUser, setSelectedUser] = useState<iUser>()

	function handleAddNewFriend() {
		console.log('new Friend', selectedUser)
		if (selectedUser) {
			addFriend(selectedUser.user_id)
		}
		setShowNewFriendModal(false)
	}

	useEffect(() => {
		if (!showNewFriendModal) {
			setSelectedUser(undefined)
		}
	}, [showNewFriendModal])

	return (
		<ModalWithCloseOutside
			isOpen={showNewFriendModal}
			setIsOpen={setShowNewFriendModal}
		>
			<NewFriendModalContainer>
				<h2>New Friend</h2>
				<UserInput
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
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
		</ModalWithCloseOutside>
	)
}
