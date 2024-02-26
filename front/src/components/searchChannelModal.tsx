import { useContext, useEffect, useState } from 'react'
import Modal from './modal'
import Button from './button'
import { MdClose, MdGroup, MdGroupAdd } from 'react-icons/md'
import { ChatContext } from '@/contexts/ChatContext'
import { SearchChannelModalContainer } from '@/styles/components/searchChannelModal'

interface iSearchChannelModal {
	showSearchChannelModal: boolean
	setShowSearchChannelModal: (state: boolean) => void
}
export default function SearchChannelModal({
	showSearchChannelModal,
	setShowSearchChannelModal,
}: iSearchChannelModal) {
	const [channelName, setChannelName] = useState('')

	function handleClose() {
		console.log('close')
		setShowSearchChannelModal(false)
	}

	function handleCreateSearchChannel() {
		console.log('CreateSearchChannel:')
		console.log('channelName:', channelName)
		// if (selectedUser) {
		// 	createDirectChat(selectedUser.user_id)
		// }
		// setShowSearchChannelModal(false)
	}

	useEffect(() => {
		if (showSearchChannelModal === false) {
			setChannelName('')
		}
	}, [showSearchChannelModal])

	return (
		<Modal isOpen={showSearchChannelModal}>
			<SearchChannelModalContainer>
				<h2>Search Channel</h2>
				<input
					type="text"
					placeholder="Channel Name"
					value={channelName}
					onChange={(e) => setChannelName(e.target.value)}
				/>

				<div className="buttonsContainer">
					<Button buttonType="cancel" onClick={handleClose}>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button
						buttonType="accept"
						onClick={handleCreateSearchChannel}
					>
						<MdGroup size={40} />
						Join
					</Button>
				</div>
			</SearchChannelModalContainer>
		</Modal>
	)
}
