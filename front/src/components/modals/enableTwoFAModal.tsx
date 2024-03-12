import { FormEvent, useEffect, useRef, useState } from 'react'
import Button from '../button'
import { MdCheck, MdClose } from 'react-icons/md'
import { EnableTwoFAModalContainer } from '@/styles/components/enableTwoFAModal'
import Image from 'next/image'
import TwoFAInput from '../TwoFAInput'
import Modal from './modal'
import { toast } from 'react-toastify'
import { api } from '@/services/api'

interface iEnableTwoFAModal {
	showEnableTwoFAModal: boolean
	setShowEnableTwoFAModal: (state: boolean) => void
	setIsTwoFactorEnabled: (state: boolean) => void
}

export default function EnableTwoFAModal({
	showEnableTwoFAModal,
	setShowEnableTwoFAModal,
	setIsTwoFactorEnabled,
}: iEnableTwoFAModal) {
	const [twoFaCode, setTwoFaCode] = useState('')
	const [qrCodeSrc, setQrCodeSrc] = useState('')
	const [isSubmiting, setIsSubmiting] = useState(false)
	const [hasError, setHasError] = useState(false)

	const codeInput = useRef(null)

	async function handleEnableTwoFA(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setIsSubmiting(true)
		setHasError(false)
		if (twoFaCode.length === 6) {
			try {
				await api.post(`/users/firstActiveTwoFactor`, {
					code: twoFaCode,
				})
				setIsTwoFactorEnabled(true)
				setShowEnableTwoFAModal(false)
				setTwoFaCode('')
			} catch (error: any) {
				toast(error.message ? error.message : error, {
					type: 'error',
				})
			}
		} else {
			toast('The code must contain 6 numbers', {
				type: 'error',
			})
			setHasError(true)
			;(codeInput.current as unknown as HTMLElement).focus()
		}
		setIsSubmiting(false)
	}

	async function getQrCode() {
		try {
			setHasError(false)
			const response = await api.post(
				`/users/activeTwoFactor`,
				{},
				{
					responseType: 'arraybuffer',
				},
			)
			const base64String = btoa(
				new Uint8Array(response.data).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					'',
				),
			)
			setQrCodeSrc(`data:image/png;base64,${base64String}`)
		} catch (error: any) {
			toast(error.message ? error.message : error, {
				type: 'error',
			})
		}
	}

	useEffect(() => {
		if (showEnableTwoFAModal) {
			getQrCode()
		} else {
			setQrCodeSrc('')
		}
	}, [showEnableTwoFAModal, setIsTwoFactorEnabled])

	return (
		<Modal isOpen={showEnableTwoFAModal}>
			<EnableTwoFAModalContainer onSubmit={handleEnableTwoFA}>
				<h2>Enable 2FA</h2>

				{qrCodeSrc ? (
					<Image
						src={qrCodeSrc || '/assets/loading.gif'}
						width={180}
						height={180}
						alt="QrCode"
					/>
				) : (
					<Image
						src={'/assets/loading.gif'}
						width={180}
						height={180}
						alt="Loading"
					/>
				)}

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
