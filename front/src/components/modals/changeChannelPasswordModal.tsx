/* eslint-disable camelcase */
import { useEffect, useState } from 'react'
import Modal from './modal'
import Button from '../button'
import { MdClose } from 'react-icons/md'
import { ChangeChannelPasswordModalContainer } from '../../styles/components/changeChannelPasswordModal'

import { z } from 'zod'
import { GrUpdate } from 'react-icons/gr'

const passwordSchema = z
	.string()
	.min(6, 'The password must contain at least 6 character(s)')
	.refine((pwd) => /[0-9]/.test(pwd), {
		message: 'The password must have a number.',
	})
	.refine((pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), {
		message: 'The password must have a special character.',
	})
	.refine((pwd) => /[A-Z]/.test(pwd), {
		message: 'The password must have an Upper case letter.',
	})

interface iChangeChannelPasswordModal {
	showChangeChannelPasswordModal: boolean
	setShowChangeChannelPasswordModal: (state: boolean) => void
}
export default function ChangeChannelPasswordModal({
	showChangeChannelPasswordModal,
	setShowChangeChannelPasswordModal,
}: iChangeChannelPasswordModal) {
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const iconSize = 40

	function handleClose() {
		console.log('close')
		setShowChangeChannelPasswordModal(false)
	}

	function handleChangeChannelPassowrd() {
		console.log('ChangeChannelPassowrd:', password)

		const validatePassword = passwordSchema.safeParse(password)
		if (!validatePassword.success) {
			const errors = (validatePassword as any).error.format()._errors
			setError(errors[0])
			return
		} else {
			console.log('password changed to: ', password)
			setError('')
		}

		setShowChangeChannelPasswordModal(false)
	}

	useEffect(() => {
		if (showChangeChannelPasswordModal === false) {
			setPassword('')
			setError('')
		}
	}, [showChangeChannelPasswordModal])

	return (
		<Modal isOpen={showChangeChannelPasswordModal}>
			<ChangeChannelPasswordModalContainer>
				<h2>Change Password</h2>
				<div className="inputContainer">
					<input
						type="text"
						placeholder="Password"
						className={error ? 'hasError' : ''}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<span>{error}</span>
				</div>

				<div className="buttonsContainer">
					<Button buttonType="cancel" onClick={handleClose}>
						<MdClose size={iconSize} />
						Cancel
					</Button>
					<Button
						buttonType="accept"
						onClick={handleChangeChannelPassowrd}
						disabled={password === ''}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								width: iconSize,
								height: iconSize,
							}}
						>
							<GrUpdate size={iconSize - 16.67} />
						</div>
						Password
					</Button>
				</div>
			</ChangeChannelPasswordModalContainer>
		</Modal>
	)
}
