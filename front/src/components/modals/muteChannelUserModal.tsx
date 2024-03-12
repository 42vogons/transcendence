/* eslint-disable camelcase */
import { useContext, useEffect, useState } from 'react'
import Button from '../button'
import { MdClose } from 'react-icons/md'
import { MuteChannelUserModalContainer } from '../../styles/components/muteChannelUserModal'

import { z } from 'zod'
import ModalWithCloseOutside from './modalWithCloseOutside'
import { BiVolumeMute } from 'react-icons/bi'
import { toast } from 'react-toastify'
import { ChatContext } from '@/contexts/ChatContext'

const minDuration = 1
const maxDuration = 60

const muteDurationSchema = z.number().int().min(minDuration).max(maxDuration)

export interface iMuteData {
	user_id: number
	username: string
	channel_id: number
	channelName: string
}

interface iMuteChannelUserModal {
	showMuteChannelUserModal: boolean
	setShowMuteChannelUserModal: (state: boolean) => void
	muteData: iMuteData
}

export default function MuteChannelUserModal({
	showMuteChannelUserModal,
	setShowMuteChannelUserModal,
	muteData,
}: iMuteChannelUserModal) {
	const [muteDuration, setMuteDuration] = useState(1)
	const [error, setError] = useState('')

	const { user_id, username, channel_id, channelName } = muteData

	const { adminAtion } = useContext(ChatContext)

	const iconSize = 40

	function handleClose() {
		setShowMuteChannelUserModal(false)
	}

	function handleMuteUser() {
		const validatePassword = muteDurationSchema.safeParse(
			Number(muteDuration),
		)
		if (!validatePassword.success) {
			const errors = (validatePassword as any).error.format()._errors
			setError(errors[0])
			return
		} else {
			setError('')
			adminAtion(user_id, channel_id, 'mute', muteDuration)
		}

		setShowMuteChannelUserModal(false)
	}

	useEffect(() => {
		if (showMuteChannelUserModal === false) {
			setMuteDuration(1)
			setError('')
		} else {
			if (user_id === 0 || channel_id === 0) {
				toast('An error ocurred when opening the modal', {
					type: 'error',
					draggable: false,
				})
				setShowMuteChannelUserModal(false)
			}
		}
	}, [
		showMuteChannelUserModal,
		setShowMuteChannelUserModal,
		user_id,
		channel_id,
	])

	return (
		<ModalWithCloseOutside
			isOpen={showMuteChannelUserModal}
			setIsOpen={setShowMuteChannelUserModal}
		>
			<MuteChannelUserModalContainer>
				<h2>
					{`Mute ${username}`}
					<br />
					{`on Channel ${channelName}`}
				</h2>

				<div className="inputContainer">
					<label htmlFor="duration">Duration in minutes</label>
					<input
						id="duration"
						type="number"
						placeholder="Duration"
						className={error ? 'hasError' : ''}
						value={muteDuration}
						min={minDuration}
						max={maxDuration}
						onChange={(e) =>
							setMuteDuration(Number(e.target.value))
						}
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
						onClick={handleMuteUser}
						disabled={muteDuration === 0}
					>
						<BiVolumeMute size={iconSize} />
						Mute
					</Button>
				</div>
			</MuteChannelUserModalContainer>
		</ModalWithCloseOutside>
	)
}
