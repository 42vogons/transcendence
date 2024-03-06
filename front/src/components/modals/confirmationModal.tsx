import Modal from './modal'
import Button from '../button'
import { MdCheck, MdClose } from 'react-icons/md'
import { ConfirmationModalContainer } from '@/styles/components/confirmationModal'

interface iConfirmationModal {
	showConfirmationModal: boolean
	setShowConfirmationModal: (state: boolean) => void
	title: string
	message: string
	onConfirmation: () => void
}
export default function ConfirmationModal({
	showConfirmationModal,
	setShowConfirmationModal,
	title,
	message,
	onConfirmation,
}: iConfirmationModal) {
	function handleConfirmation() {
		console.log('confirm')
		onConfirmation()
		setShowConfirmationModal(false)
	}

	return (
		<Modal isOpen={showConfirmationModal}>
			<ConfirmationModalContainer>
				<h2>{title}</h2>
				<h3>{message}</h3>

				<div className="buttonsContainer">
					<Button
						buttonType="cancel"
						onClick={() => {
							console.log('close')
							setShowConfirmationModal(false)
						}}
					>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button buttonType="accept" onClick={handleConfirmation}>
						<MdCheck size={40} />
						Create
					</Button>
				</div>
			</ConfirmationModalContainer>
		</Modal>
	)
}
