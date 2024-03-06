import Button from '../button'
import { MdCheck, MdClose } from 'react-icons/md'
import { ConfirmationModalContainer } from '@/styles/components/confirmationModal'
import ModalWithCloseOutside from './modalWithCloseOutside'
import { useState } from 'react'

interface iConfirmationModal {
	showConfirmationModal: boolean
	setShowConfirmationModal: (state: boolean) => void
	title: string
	message: string
	onConfirmation: () => Promise<void>
}
export default function ConfirmationModal({
	showConfirmationModal,
	setShowConfirmationModal,
	title,
	message,
	onConfirmation,
}: iConfirmationModal) {
	const [isDisabled, setIsDisabled] = useState(false)
	async function handleConfirmation() {
		console.log('confirm')
		setIsDisabled(true)
		await onConfirmation()
		setShowConfirmationModal(false)
		setIsDisabled(false)
	}

	return (
		<ModalWithCloseOutside
			isOpen={showConfirmationModal}
			setIsOpen={setShowConfirmationModal}
		>
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
					<Button
						disabled={isDisabled}
						buttonType="accept"
						onClick={handleConfirmation}
					>
						<MdCheck size={40} />
						Confirm
					</Button>
				</div>
			</ConfirmationModalContainer>
		</ModalWithCloseOutside>
	)
}
