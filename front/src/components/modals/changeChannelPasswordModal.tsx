/* eslint-disable camelcase */
import { useContext, useEffect, useState } from 'react'
import Button from '../button'
import { MdClose } from 'react-icons/md'
import { ChangeChannelPasswordModalContainer } from '../../styles/components/changeChannelPasswordModal'

import { z } from 'zod'
import { GrUpdate } from 'react-icons/gr'
import ModalWithCloseOutside from './modalWithCloseOutside'
import { ChatContext } from '@/contexts/ChatContext'
import { api } from '@/services/api'
import { toast } from 'react-toastify'
import { delayMs } from '@/utils/functions'

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
	channel_id: number
}
export default function ChangeChannelPasswordModal({
	showChangeChannelPasswordModal,
	setShowChangeChannelPasswordModal,
	channel_id,
}: iChangeChannelPasswordModal) {
	const { getChannelList, getChannelMessages } = useContext(ChatContext)
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const iconSize = 40

	function handleClose() {
		setShowChangeChannelPasswordModal(false)
	}

	async function handleChangeChannelPassword() {
		const validatePassword = passwordSchema.safeParse(password)
		if (!validatePassword.success) {
			const errors = (validatePassword as any).error.format()._errors
			setError(errors[0])
		} else {
			setError('')
			try {
				const data = { password }
				await api.patch(`/channel/changePassword/${channel_id}`, data)
				await delayMs(500)
				getChannelList()
				getChannelMessages(channel_id)
				setShowChangeChannelPasswordModal(false)
				toast('Password changed.', {
					type: 'info',
					draggable: false,
				})
			} catch (error: any) {
				toast(error.message ? error.message : error, {
					type: 'error',
					draggable: false,
				})
			}
		}
	}

	useEffect(() => {
		if (showChangeChannelPasswordModal === false) {
			setPassword('')
			setError('')
		}
	}, [showChangeChannelPasswordModal])

	return (
		<ModalWithCloseOutside
			isOpen={showChangeChannelPasswordModal}
			setIsOpen={setShowChangeChannelPasswordModal}
		>
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
						onClick={handleChangeChannelPassword}
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
		</ModalWithCloseOutside>
	)
}
