import {
	EditProfileContainer,
	EditProfileImageContainer,
	EditProfileWrapper,
	InputContainer,
	SwitchButton,
	SwitchContainer,
	TwoFAContainer,
} from '@/styles/pages/editProfile'
import Image from 'next/image'
import { FaUserAstronaut } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'

import userDefaulAvatar from '../../../public/assets/user.png'
import {
	FormEvent,
	ReactElement,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { useRouter } from 'next/router'
import { api } from '@/services/api'
import { toast } from 'react-toastify'
import { UserContext } from '@/contexts/UserContext'
import { LoadingContainer } from '@/styles/pages/profile'
import Loading from '@/components/loading'
import Layout from '@/components/layout'
import Button from '@/components/button'
import { SwitchThumb } from '@radix-ui/react-switch'
import { GrUpdate } from 'react-icons/gr'
import { delayMs } from '@/utils/functions'
import { z } from 'zod'
import { config } from 'process'

const editUsernameSchema = z
	.string()
	.length(8, { message: 'Username must be exactly 8 characters long' })
	.regex(/^[a-zA-Z0-9-]+$/, {
		message: 'Username must contain only letters, numbers or hyphen',
	})

export default function EditProfile() {
	const router = useRouter()
	const { user, handleLogin } = useContext(UserContext)

	const usernameInput = useRef(null)

	const [isLoading, setIsLoading] = useState(true)
	const [username, setUsername] = useState('')
	const [avatarUrl, setAvatarUrl] = useState('')
	const [error, setError] = useState('')
	const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false)
	const [isUsernameDisabled, setIsUsernameDisabled] = useState(true)

	async function handleEditUsername() {
		setIsUsernameDisabled(false)
		await delayMs(100)
		;(usernameInput.current as unknown as HTMLElement).focus()
	}

	async function handleSubmitEditUsername(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		console.log('submit')
		const validateUsername = editUsernameSchema.safeParse(username)
		if (!validateUsername.success) {
			const errors = (validateUsername as any).error.format()._errors
			setError(errors[0])
		} else {
			setError('')
			try {
				await api.patch('/users/', { username })
				if (user) {
					const updatedUser = user
					updatedUser.username = username
					handleLogin(updatedUser)
				}
				toast('Username updated.', {
					type: 'success',
				})
				setIsUsernameDisabled(true)
			} catch (error: any) {
				toast(error.response.data.message[0].message, {
					type: 'error',
				})
			}
		}
	}

	async function handleToogleTwoFA() {
		console.log('handleToogleTwoFA:', isTwoFactorEnabled)
		if (isTwoFactorEnabled) {
			console.log('fazer req')
			try {
				const { data } = await api.post(`/users/activeTwoFactor`)
				console.log('activeTwoFactor data:', data)
				setIsTwoFactorEnabled(false)
			} catch (error: any) {
				console.log('error:', error)
				toast(error.message ? error.message : error, {
					type: 'error',
				})
			}
		} else {
			console.log('abrir modal')
			try {
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
				const qrCodeUrl = `data:image/png;base64,${base64String}`
			} catch (error: any) {
				console.log('error:', error)
				toast(error.message ? error.message : error, {
					type: 'error',
				})
			}
			// setIsTwoFactorEnabled(true)
		}
	}

	useEffect(() => {
		console.log('TwoFA:', isTwoFactorEnabled)
	}, [isTwoFactorEnabled])

	useEffect(() => {
		async function getUserData() {
			setIsLoading(true)
			try {
				const { data: userData } = await api.get(`/users/me`)
				setUsername(userData.username)
				setAvatarUrl(userData.avatar_url)
				setIsTwoFactorEnabled(userData.two_factor_enabled)
				setIsLoading(false)
			} catch (error: any) {
				console.log('error:', error)
				setUsername('')
				setAvatarUrl('')
				setIsTwoFactorEnabled(false)
				setIsLoading(false)
				toast(error.message ? error.message : error, {
					type: 'error',
				})
			}
		}

		if (router.isReady && user) {
			getUserData()
		} else {
			setIsLoading(false)
			toast('Error', {
				type: 'error',
			})
		}
	}, [router.isReady, user])

	return isLoading ? (
		<LoadingContainer>
			<Loading size={200} />
		</LoadingContainer>
	) : (
		<EditProfileWrapper>
			<EditProfileContainer>
				<h2>Edit Profile</h2>
				<EditProfileImageContainer>
					<Image
						src={avatarUrl || userDefaulAvatar.src}
						width={180}
						height={180}
						alt="user"
						placeholder="blur"
						blurDataURL={userDefaulAvatar.src}
					/>
					<div className="icon">
						<MdEdit size={32} />
					</div>
				</EditProfileImageContainer>
				<InputContainer onSubmit={(e) => handleSubmitEditUsername(e)}>
					<input
						type="text"
						value={username}
						maxLength={8}
						onChange={(e) => setUsername(e.target.value)}
						ref={usernameInput}
						disabled={isUsernameDisabled}
					/>
					<FaUserAstronaut size={32} className="icon" />
					<span>{error}</span>

					{isUsernameDisabled && (
						<Button type="button" onClick={handleEditUsername}>
							<MdEdit size={32} />
							Username
						</Button>
					)}
					{!isUsernameDisabled && (
						<Button buttonType="accept" type="submit">
							<GrUpdate size={32} />
							Username
						</Button>
					)}
				</InputContainer>

				<TwoFAContainer
					isTwoFAEnabled={isTwoFactorEnabled}
					onClick={handleToogleTwoFA}
				>
					<SwitchContainer>
						<label
							htmlFor="2fa"
							style={{
								color: isTwoFactorEnabled
									? '$green500'
									: '$gray600',
							}}
						>
							2FA
						</label>
						<SwitchButton
							id="2fa"
							checked={isTwoFactorEnabled}
							// onCheckedChange={(value) =>
							// 	setIsTwoFactorEnabled(value)
							// }
							// ref={switchButtonRef}
						>
							<SwitchThumb asChild>
								<div className="thumb">
									{isTwoFactorEnabled ? 'On' : 'Off'}
								</div>
							</SwitchThumb>
						</SwitchButton>
					</SwitchContainer>
				</TwoFAContainer>
			</EditProfileContainer>
		</EditProfileWrapper>
	)
}

EditProfile.getLayout = (page: ReactElement) => {
	return <Layout>{page}</Layout>
}
