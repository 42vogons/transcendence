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
import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
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

export default function EditProfile() {
	const router = useRouter()
	const { user } = useContext(UserContext)

	const usernameInput = useRef(null)
	const switchButtonRef = useRef(null)

	const [isLoading, setIsLoading] = useState(true)
	const [username, setUsername] = useState('')
	const [avatarUrl, setAvatarUrl] = useState('')
	const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false)
	const [isUsernameDisabled, setIsUsernameDisabled] = useState(true)

	async function handleChangeUsername() {
		setIsUsernameDisabled(false)
		await delayMs(100)
		;(usernameInput.current as unknown as HTMLElement).focus()
	}

	function handleToogle() {
		;(switchButtonRef.current as unknown as HTMLElement).click()
	}

	useEffect(() => {
		async function getUserData(userID: number) {
			setIsLoading(true)
			try {
				const { data: userData } = await api.get(
					`/users/findUsersByUserID/${userID}`,
				)
				setUsername(userData.username)
				setAvatarUrl(userData.avatar_url)
				setIsLoading(false)
			} catch (error: any) {
				console.log('error:', error)
				setUsername('')
				setAvatarUrl('')
				setIsLoading(false)
				toast(error.message ? error.message : error, {
					type: 'error',
				})
			}
		}

		if (router.isReady && user) {
			getUserData(Number(user?.userID))
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
				<InputContainer>
					<input
						type="text"
						value={username}
						maxLength={8}
						onChange={(e) => setUsername(e.target.value)}
						ref={usernameInput}
						disabled={isUsernameDisabled}
					/>
					<FaUserAstronaut size={32} className="icon" />
					<Button onClick={handleChangeUsername}>
						<GrUpdate size={32} />
						User
					</Button>
				</InputContainer>

				<TwoFAContainer
					isTwoFAEnabled={isTwoFactorEnabled}
					onClick={handleToogle}
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
							onCheckedChange={(value) =>
								setIsTwoFactorEnabled(value)
							}
							ref={switchButtonRef}
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
