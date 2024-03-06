/* eslint-disable camelcase */
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import Button from '../button'
import { MdClose, MdGroup } from 'react-icons/md'
import { ChatContext } from '@/contexts/ChatContext'
import {
	ChannelInputContainer,
	ChannelList,
	JoinChannelModalContainer,
	LoadingContainer,
	ChannelListItem,
	ChannelName,
	ChannelAvatarContainer,
} from '../../styles/components/joinChannelModal'
import { api } from '@/services/api'
import Loading from '../loading'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { IoSearchSharp } from 'react-icons/io5'
import { z } from 'zod'

import privateDefaulAvatar from '../../../public/assets/private.png'
import protectedDefaulAvatar from '../../../public/assets/protected.png'
import publicDefaulAvatar from '../../../public/assets/public.png'
import { useRouter } from 'next/router'
import ModalWithCloseOutside from './modalWithCloseOutside'
import { delayMs } from '@/utils/delay'

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

interface iChannel {
	channel_id: number
	name: string
	type: string
}

interface iJoinChannelModal {
	showJoinChannelModal: boolean
	setShowJoinChannelModal: (state: boolean) => void
}
export default function JoinChannelModal({
	showJoinChannelModal,
	setShowJoinChannelModal,
}: iJoinChannelModal) {
	const router = useRouter()
	const { getChannelList } = useContext(ChatContext)

	const [channelName, setChannelName] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [selectedChannel, setSelectedChannel] = useState<
		iChannel | undefined
	>(undefined)
	const [channelList, setChannelList] = useState<iChannel[]>([])
	const [filteredChannelList, setFilteredChannelList] =
		useState<iChannel[]>(channelList)
	const [isOptionsLoading, setIsOptionsLoading] = useState(false)

	function handleClose() {
		console.log('close')
		setShowJoinChannelModal(false)
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setSelectedChannel(undefined)
		setChannelName(e.target.value)
	}

	async function getAllChannels() {
		setIsOptionsLoading(true)
		try {
			const { data } = await api.get('/channel/channels')
			console.log('channelList:', data)
			setChannelList(data)
			setIsOptionsLoading(false)
		} catch (error: any) {
			console.log('error:', error)
			toast(error.message ? error.message : error, {
				type: 'error',
			})
			setIsOptionsLoading(false)
		}
	}

	function getChannelAvatar(channel: iChannel) {
		if (channel.type === 'protected') {
			return protectedDefaulAvatar.src
		} else if (channel.type === 'private') {
			return privateDefaulAvatar.src
		} else {
			return publicDefaulAvatar.src
		}
	}

	function handleSelect(channel: iChannel) {
		console.log('channel selected', channel)
		setSelectedChannel(channel)
		setChannelName(channel.name)
	}

	async function handleJoinChannel() {
		console.log('CreateJoinChannel:')
		console.log('channelName:', channelName, selectedChannel, password)

		let formData

		if (selectedChannel) {
			const { channel_id } = selectedChannel

			if (selectedChannel?.type === 'protected') {
				const validatePassword = passwordSchema.safeParse(password)
				if (!validatePassword.success) {
					const errors = (validatePassword as any).error.format()
						._errors
					setError(errors[0])
					return
				} else {
					setError('')
					formData = { channel_id, password }
				}
			} else {
				formData = { channel_id }
			}
			try {
				await api.post('/channel/joinChannel', formData)
				await delayMs(500)
				getChannelList()
				setShowJoinChannelModal(false)
				router.push('/chat/' + channel_id)
			} catch (error: any) {
				console.log('error:', error)
				toast(error.message ? error.message : error, {
					type: 'error',
				})
			}
		}
	}

	useEffect(() => {
		if (showJoinChannelModal === false) {
			setChannelName('')
			setPassword('')
			setError('')
			setSelectedChannel(undefined)
			setChannelList([])
			setFilteredChannelList([])
			setIsOptionsLoading(false)
		} else {
			getAllChannels()
		}
	}, [showJoinChannelModal])

	useEffect(() => {
		function filterChannelsByName(name: string) {
			return name
				? channelList.filter((channel) =>
						channel.name
							.toLowerCase()
							.startsWith(name.toLowerCase()),
				  )
				: channelList
		}
		setIsOptionsLoading(true)
		setFilteredChannelList(filterChannelsByName(channelName))
		setIsOptionsLoading(false)
		console.log(
			'filterChannelsByName(channelName):',
			filterChannelsByName(channelName),
		)
	}, [channelName, channelList])

	return (
		<ModalWithCloseOutside
			isOpen={showJoinChannelModal}
			setIsOpen={setShowJoinChannelModal}
		>
			<JoinChannelModalContainer>
				<h2>Join Channel</h2>
				<ChannelInputContainer
					hasOption={
						!selectedChannel && filteredChannelList.length > 0
					}
				>
					{!selectedChannel ? (
						<IoSearchSharp className="icon" size={32} />
					) : (
						<ChannelAvatarContainer className="icon">
							<Image
								src={getChannelAvatar(selectedChannel)}
								width={32}
								height={32}
								alt="user"
							/>
						</ChannelAvatarContainer>
					)}
					<input
						type="text"
						placeholder="Channel Name"
						value={channelName}
						onChange={(e) => handleChange(e)}
					/>
					{!selectedChannel && isOptionsLoading && (
						<ChannelList>
							<LoadingContainer>
								<Loading size={42} />
								Loading...
							</LoadingContainer>
						</ChannelList>
					)}
					{!selectedChannel &&
						!isOptionsLoading &&
						filteredChannelList.length > 0 && (
							<ChannelList>
								{filteredChannelList.map(
									(channel: iChannel) => (
										<ChannelListItem
											key={channel.channel_id}
											onClick={() =>
												handleSelect(channel)
											}
										>
											<ChannelAvatarContainer>
												<Image
													src={getChannelAvatar(
														channel,
													)}
													width={32}
													height={32}
													alt={channel.type}
												/>
											</ChannelAvatarContainer>
											<ChannelName>
												{channel.name}
											</ChannelName>
										</ChannelListItem>
									),
								)}
							</ChannelList>
						)}
				</ChannelInputContainer>
				{selectedChannel && selectedChannel.type === 'protected' && (
					<div className="inputContainer">
						<input
							type="text"
							placeholder="Channel Password"
							className={error ? 'hasError' : ''}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span>{error}</span>
					</div>
				)}

				<div className="buttonsContainer">
					<Button buttonType="cancel" onClick={handleClose}>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button
						buttonType="accept"
						disabled={!selectedChannel}
						onClick={handleJoinChannel}
					>
						<MdGroup size={40} />
						Join
					</Button>
				</div>
			</JoinChannelModalContainer>
		</ModalWithCloseOutside>
	)
}
