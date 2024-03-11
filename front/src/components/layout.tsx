import { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { FaGamepad, FaUserAstronaut, FaUserPlus } from 'react-icons/fa6'
import { FaUserFriends } from 'react-icons/fa'
import { BsChatSquareTextFill } from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'
import {
	MdOutlineMenu,
	MdOutlineArrowBackIos,
	MdClose,
	MdGroupAdd,
} from 'react-icons/md'

import {
	ApplicationContainer,
	LayoutContainer,
	LoadingContainer,
	PageContainer,
	SidePanelContainer,
	SidebarContainer,
} from '@/styles/components/layout'
import IconButton from './iconButton'
import MenuListItem from './menuListItem'

import { useOutsideMenuClick } from '@/hooks/useOutsideMenuClick'
import { FriendListItem } from './friendListItem'
import { FriendListItem as iFriendListItem } from '@/reducers/Chat/Reducer'
import { ChatListItem } from './chatListItem'
import { UserContext } from '@/contexts/UserContext'
import { toast } from 'react-toastify'
import { isDateExpired } from '@/reducers/User/Reducer'
import { GameContext } from '@/contexts/GameContext'
import NewChatModal from './modals/newChatModal'
import { ChatContext } from '@/contexts/ChatContext'
import NewFriendModal from './modals/newFriendModal'
import { IoSearchSharp } from 'react-icons/io5'
import JoinChannelModal from './modals/joinChannelModal'
import NewChannelModal from './modals/newChannelModal'
import { iLastChannelMessage } from '@/reducers/Chat/Types'
import Loading from './loading'

type activePanelType = 'menu' | 'friends' | 'chat'

interface iMenuItemType {
	icon: ReactNode
	title: string
	isActive?: boolean
	handleOnClick?: () => void | undefined
}

interface iLayoutProps {
	children: ReactNode
}

export default function Layout({ children }: iLayoutProps) {
	const iconSize = 28
	const iconSizeMobile = 24
	const iconSizeMenuOptions = 28

	const router = useRouter()

	const { handleLogout } = useContext(UserContext)
	const { handleUpdateDimensions, PageContainerRef } = useContext(GameContext)

	const [currentPath, setCurrentPath] = useState('')
	const [showSidePanel, setShowSidePanel] = useState(false)
	const [showNewChatModal, setShowNewChatModal] = useState(false)
	const [showNewFriendModal, setShowNewFriendModal] = useState(false)
	const [showNewChannelModal, setShowNewChannelModal] = useState(false)
	const [showJoinChannelModal, setShowJoinChannelModal] = useState(false)
	const [activePanel, setActivePanel] = useState<activePanelType>('friends')

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	function toggleSidePanel() {
		setShowSidePanel((previousState) => !previousState)
	}

	function closeSidePanel() {
		if (window.innerWidth < 1024) {
			setShowSidePanel(false)
		}
	}

	const ref = useOutsideMenuClick(closeSidePanel)

	useEffect(() => {
		function handleResize() {
			if (PageContainerRef) {
				if (PageContainerRef.current) {
					const { offsetWidth, offsetHeight } =
						PageContainerRef.current as unknown as HTMLElement

					handleUpdateDimensions([offsetWidth, offsetHeight])
				}
			}

			if (window.innerWidth <= 1024) {
				setActivePanel('menu')
				setShowSidePanel(false)
			} else {
				setShowSidePanel(true)
				if (router.asPath.includes('/chat')) {
					setActivePanel('chat')
				} else {
					setActivePanel('friends')
				}
			}
		}
		handleResize()

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.asPath])

	const menuItems: iMenuItemType[] = [
		{
			icon: <FaGamepad size={iconSize} />,
			title: 'Game',
			isActive: currentPath === '/',
			handleOnClick: () => {
				console.log('game')
				router.push('/')
			},
		},
		{
			icon: <FaUserAstronaut size={iconSize} />,
			title: 'Profile',
			isActive: currentPath.includes('/profile'),
			handleOnClick: () => {
				router.push('/profile')
				if (window.innerWidth > 1024) {
					setActivePanel('friends')
				}
			},
		},
		{
			icon: <BsChatSquareTextFill size={iconSize} />,
			title: 'Chat',
			isActive: currentPath.includes('/chat'),
			handleOnClick: () => {
				setActivePanel('chat')
			},
		},
		{
			icon: <FaUserFriends size={iconSize} />,
			title: 'Friends',
			handleOnClick: () => {
				if (activePanel === 'friends') {
					toggleSidePanel()
				} else {
					setActivePanel('friends')
				}
			},
		},
		{
			icon: <BiLogOut size={iconSize} />,
			title: 'Logout',
			handleOnClick: () => {
				handleLogout()
			},
		},
	]

	const { user } = useContext(UserContext)
	const {
		friendList,
		activeChannelData,
		channelList,
		getActiveChannelName,
		getActiveChannelAvatar,
		closeChatSocket,
	} = useContext(ChatContext)
	const { closeGameSocket } = useContext(GameContext)

	useEffect(() => {
		const isAuthenticated = user && !isDateExpired(user?.expiresAt as Date)
		if (!isAuthenticated) {
			closeGameSocket()
			closeChatSocket()
			localStorage.removeItem('@42Transcendence:user')
			toast('Your session is expired', {
				type: 'error',
			})
			router.push('/login')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, router])

	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	return isClient && user && !isDateExpired(user?.expiresAt as Date) ? (
		<LayoutContainer>
			<ApplicationContainer>
				<SidebarContainer>
					{menuItems.map((item: iMenuItemType) => (
						<IconButton
							key={item.title}
							title={item.title}
							isActive={item.isActive}
							handleOnClick={item.handleOnClick}
							type="desktop"
						>
							{item.icon}
						</IconButton>
					))}
					<IconButton
						title="Menu"
						type="mobile"
						handleOnClick={() => {
							toggleSidePanel()
						}}
					>
						<MdOutlineMenu size={iconSizeMobile} />
					</IconButton>
				</SidebarContainer>
				{showSidePanel === true && (
					<SidePanelContainer
						hasGap={activePanel === 'menu'}
						isActive={showSidePanel}
						ref={ref}
					>
						<div className="menuHeader">
							{activePanel !== 'menu' && (
								<IconButton
									title="Menu"
									type="mobile"
									handleOnClick={() => {
										setActivePanel('menu')
									}}
								>
									<MdOutlineArrowBackIos
										size={iconSizeMobile}
									/>
								</IconButton>
							)}
							<span>{activePanel}</span>
							<IconButton
								title="Close"
								type="mobile"
								handleOnClick={() => {
									setShowSidePanel(false)
								}}
							>
								<MdClose size={iconSizeMobile} />
							</IconButton>
						</div>
						<div className="content">
							{showSidePanel === true &&
								activePanel === 'menu' &&
								menuItems.map((item: iMenuItemType) => (
									<MenuListItem
										key={item.title}
										title={item.title}
										isActive={item.isActive}
										handleOnClick={item.handleOnClick}
									>
										{item.icon}
									</MenuListItem>
								))}

							{showSidePanel === true &&
								activePanel === 'friends' && (
									<>
										<div className="menuOptions">
											<IconButton
												handleOnClick={() => {
													console.log('new Friend')
													setShowNewFriendModal(true)
												}}
												title="Add Friend"
											>
												<FaUserPlus
													size={iconSizeMenuOptions}
												/>
											</IconButton>
										</div>
										{friendList.length > 0 ? (
											friendList.map(
												(item: iFriendListItem) => (
													<FriendListItem
														key={item.userID}
														userID={item.userID}
														userAvatarSrc={
															item.userAvatarSrc
														}
														username={item.username}
														userStatus={
															item.userStatus
														}
													/>
												),
											)
										) : (
											<p>vazio</p>
										)}
									</>
								)}

							{showSidePanel === true &&
								activePanel === 'chat' && (
									<>
										<div className="menuOptions">
											<IconButton
												title="Create Direct Chat"
												handleOnClick={() => {
													console.log('new chat')
													setShowNewChatModal(true)
												}}
											>
												<FaUserPlus
													size={iconSizeMenuOptions}
												/>
											</IconButton>
											<IconButton
												title="Create Channel"
												handleOnClick={() => {
													console.log('new channel')
													setShowNewChannelModal(true)
												}}
											>
												<MdGroupAdd
													size={iconSizeMenuOptions}
												/>
											</IconButton>
											<IconButton
												title="Join Channel"
												handleOnClick={() => {
													console.log('join channel')
													setShowJoinChannelModal(
														true,
													)
												}}
											>
												<IoSearchSharp
													size={iconSizeMenuOptions}
												/>
											</IconButton>
										</div>
										{channelList.map(
											(channel: iLastChannelMessage) => (
												<ChatListItem
													key={channel.channelId}
													channelType={channel.type}
													avatarSrc={getActiveChannelAvatar(
														channel.type,
														channel.channelMembers,
													)}
													name={getActiveChannelName(
														channel.channelName,
														channel.type,
														channel.channelMembers,
													)}
													lastUserID={channel.user_id}
													lastUsername={
														channel.userName
													}
													lastMessage={
														channel.lastMessage
													}
													isActive={
														channel.channelId ===
														activeChannelData
															?.channel.channel_id
													}
													handleOnClick={() =>
														router.push(
															'/chat' +
																'/' +
																channel.channelId,
														)
													}
												/>
											),
										)}
									</>
								)}
						</div>
					</SidePanelContainer>
				)}
				<PageContainer
					className="pageContainer"
					ref={PageContainerRef}
					isSidePanelActive={showSidePanel}
				>
					{children}
				</PageContainer>
			</ApplicationContainer>
			<NewFriendModal
				setShowNewFriendModal={setShowNewFriendModal}
				showNewFriendModal={showNewFriendModal}
			/>
			<NewChatModal
				setShowNewChatModal={setShowNewChatModal}
				showNewChatModal={showNewChatModal}
			/>
			<NewChannelModal
				setShowNewChannelModal={setShowNewChannelModal}
				showNewChannelModal={showNewChannelModal}
			/>
			<JoinChannelModal
				setShowJoinChannelModal={setShowJoinChannelModal}
				showJoinChannelModal={showJoinChannelModal}
			/>
		</LayoutContainer>
	) : (
		<LoadingContainer>
			<Loading size={200} />
		</LoadingContainer>
	)
}
