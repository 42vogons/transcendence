import { useContext, useEffect, useState } from 'react'
import Button from '../button'
import { MdCheck, MdClose } from 'react-icons/md'
import { EnableTwoFAModalContainer } from '@/styles/components/enableTwoFAModal'
import ModalWithCloseOutside from './modalWithCloseOutside'
import Image from 'next/image'
import TwoFAInput from '../TwoFAInput'

interface iEnableTwoFAModal {
	showEnableTwoFAModal: boolean
	setShowEnableTwoFAModal: (state: boolean) => void
	setIsTwoFactorEnabled: (state: boolean) => void
	qrCodeSrc: string
}

export default function EnableTwoFAModal({
	showEnableTwoFAModal,
	setShowEnableTwoFAModal,
	qrCodeSrc,
	setIsTwoFactorEnabled,
}: iEnableTwoFAModal) {
	const [twoFaCode, setTwoFaCode] = useState('')

	async function handleEnableTwoFA() {
		console.log('handleEnableTwoFA:')
		console.log('twoFAcode:', twoFaCode)
		setIsTwoFactorEnabled(true)
		setShowEnableTwoFAModal(false)
	}

	return (
		<ModalWithCloseOutside
			isOpen={showEnableTwoFAModal}
			setIsOpen={setShowEnableTwoFAModal}
		>
			<EnableTwoFAModalContainer>
				<h2>Enable 2FA</h2>

				<Image src={qrCodeSrc} width={180} height={180} alt="user" />

				<TwoFAInput setTwoFaCode={setTwoFaCode} twoFaCode={twoFaCode} />

				<div className="buttonsContainer">
					<Button
						buttonType="cancel"
						onClick={() => {
							console.log('close')
							setShowEnableTwoFAModal(false)
						}}
					>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button buttonType="accept" onClick={handleEnableTwoFA}>
						<MdCheck size={40} />
						Enable
					</Button>
				</div>
			</EnableTwoFAModalContainer>
		</ModalWithCloseOutside>
	)
}
