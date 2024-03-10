import { FormEvent, useEffect, useRef, useState } from 'react'
import Button from '../button'
import { MdCheck, MdClose } from 'react-icons/md'
import { EnableTwoFAModalContainer } from '@/styles/components/enableTwoFAModal'
import Image from 'next/image'
import TwoFAInput from '../TwoFAInput'
import Modal from './modal'
import { toast } from 'react-toastify'

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
	const [isSubmiting, setIsSubmiting] = useState(false)
	const [hasError, setHasError] = useState(false)

	const codeInput = useRef(null)

	async function handleEnableTwoFA(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setIsSubmiting(true)
		setHasError(false)
		console.log('handleEnableTwoFA:')
		if (twoFaCode.length === 6) {
			// todo req
			console.log('twoFAcode:', twoFaCode)
			setIsTwoFactorEnabled(true)
			setShowEnableTwoFAModal(false)
			setTwoFaCode('')
		} else {
			toast('The code must contain 6 numbers', {
				type: 'error',
			})
			setHasError(true)
			;(codeInput.current as unknown as HTMLElement).focus()
		}
		setIsSubmiting(false)
	}

	function handleImageError() {
		toast('Unable to load QrCode', {
			type: 'error',
		})
	}

	useEffect(() => {
		if (showEnableTwoFAModal) {
			console.log('moda qrCodeSrc):', qrCodeSrc)
			if (qrCodeSrc) {
				;(codeInput.current as unknown as HTMLElement).focus()
				setHasError(false)
			}
		}
	}, [showEnableTwoFAModal, setIsTwoFactorEnabled, qrCodeSrc])

	return (
		<Modal isOpen={showEnableTwoFAModal}>
			<EnableTwoFAModalContainer onSubmit={handleEnableTwoFA}>
				<h2>Enable 2FA</h2>

				<Image
					src={qrCodeSrc}
					width={180}
					height={180}
					alt="QrCode"
					onError={handleImageError}
				/>

				<h3>
					Read the QrCode with your authentication app.
					<br />
					Type the generated code to activate.
				</h3>

				<label htmlFor="2fa">Code</label>

				<TwoFAInput
					ref={codeInput}
					setTwoFaCode={setTwoFaCode}
					twoFaCode={twoFaCode}
					hasError={hasError}
				/>

				<div className="buttonsContainer">
					<Button
						buttonType="cancel"
						type="button"
						onClick={() => {
							console.log('close')
							setShowEnableTwoFAModal(false)
						}}
					>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button
						buttonType="accept"
						type="submit"
						disabled={isSubmiting || twoFaCode.length !== 6}
					>
						<MdCheck size={40} />
						Enable
					</Button>
				</div>
			</EnableTwoFAModalContainer>
		</Modal>
	)
}
