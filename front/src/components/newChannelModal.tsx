import { useContext, useEffect, useState } from 'react'
import Modal from './modal'
import Button from './button'
import { MdClose, MdGroupAdd } from 'react-icons/md'
import { ChatContext } from '@/contexts/ChatContext'
import { NewChannelModalContainer } from '@/styles/components/newChannelModal'

interface iNewChannelModal {
	showNewChannelModal: boolean
	setShowNewChannelModal: (state: boolean) => void
}
export default function NewChannelModal({
	showNewChannelModal,
	setShowNewChannelModal,
}: iNewChannelModal) {
	const { createDirectChat } = useContext(ChatContext)

	const [channelType, setChannelType] = useState('')
	const [channelName, setChannelName] = useState('')
	const [channelPassword, setChannelPassword] = useState('')

	function handleClose() {
		console.log('close')
		setShowNewChannelModal(false)
	}

	function handleCreateNewChannel() {
		console.log('CreateNewChannel:')
		console.log('channelType:', channelType)
		console.log('channelName:', channelName)
		console.log('channelPassword:', channelPassword)
		// if (selectedUser) {
		// 	createDirectChat(selectedUser.user_id)
		// }
		// setShowNewChannelModal(false)
	}

	useEffect(() => {
		if (showNewChannelModal === false) {
			setChannelType('')
			setChannelName('')
			setChannelPassword('')
		}
	}, [showNewChannelModal])

	return (
		<Modal isOpen={showNewChannelModal}>
			<NewChannelModalContainer>
				<h2>New Channel</h2>

				<select
					name="channelType"
					value={channelType}
					onChange={(e) => setChannelType(e.target.value)}
				>
					<option value="public">public</option>
					<option value="protected">protected</option>
					<option value="private"> private</option>
					<option value="" hidden>
						Channel Type
					</option>
				</select>
				<input
					type="text"
					placeholder="Channel Name"
					value={channelName}
					onChange={(e) => setChannelName(e.target.value)}
				/>
				{channelType === 'protected' && (
					<input
						type="text"
						placeholder="Channel Password"
						value={channelPassword}
						onChange={(e) => setChannelPassword(e.target.value)}
					/>
				)}

				<div className="buttonsContainer">
					<Button buttonType="cancel" onClick={handleClose}>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button
						buttonType="accept"
						onClick={handleCreateNewChannel}
					>
						<MdGroupAdd size={40} />
						Create
					</Button>
				</div>
			</NewChannelModalContainer>
		</Modal>
	)
}
