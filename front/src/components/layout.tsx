import { ReactNode, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FaGamepad, FaUserAstronaut } from 'react-icons/fa6'
import { FaUserFriends } from 'react-icons/fa'
import { BsChatSquareTextFill } from 'react-icons/bs'
import { RiLogoutBoxFill } from 'react-icons/ri'
import { MdOutlineMenu, MdOutlineArrowBackIos, MdClose } from 'react-icons/md'

import {
	ApplicationContainer,
	LayoutContainer,
	PageContainer,
	SidePanelContainer,
	SidebarContainer,
} from '@/styles/components/layout'
import IconButton from './iconButton'
import MenuListItem from './menuListItem'

import { useOutsideMenuClick } from '@/hooks/useOutsideMenuClick'
import { FriendListItem, iFriendListItem } from './friendListItem'
import { ChatListItem, iChatListItem } from './chatListItem'
import { UserContext } from '@/contexts/UserContext'
import { toast } from 'react-toastify'
import { isDateExpired } from '@/reducers/User/Reducer'
import { GameContext } from '@/contexts/GameContext'

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

	const router = useRouter()

	const [currentPath, setCurrentPath] = useState('')
	const [showSidePanel, setShowSidePanel] = useState(false)

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	const [activePanel, setActivePanel] = useState<activePanelType>('friends')

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
			if (window.innerWidth < 1024) {
				setShowSidePanel(false)
				setActivePanel('menu')
			} else {
				setShowSidePanel(true)
				if (router.asPath !== '/chat') {
					setActivePanel('friends')
				} else {
					setActivePanel('chat')
				}
			}
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [router.asPath])

	const menuItems: iMenuItemType[] = [
		{
			icon: <FaGamepad size={iconSize} />,
			title: 'Game',
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
			icon: <RiLogoutBoxFill size={iconSize} />,
			title: 'Logout',
			handleOnClick: () => {
				console.log('logout')
			},
		},
	]

	const friendList: iFriendListItem[] = [
		{
			userAvatarSrc: '',
			username: 'rfelipe-',
			userStatus: 'ingame',
		},
		{
			userAvatarSrc: '',
			username: 'cpereira',
			userStatus: 'online',
		},
		{
			userAvatarSrc: '',
			username: 'anoliver',
			userStatus: 'online',
		},
		{
			userAvatarSrc: '',
			username: 'abc12341',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12342',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12343',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12344',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12345',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12346',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12347',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12348',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12349',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12350',
			userStatus: 'offline',
		},
		{
			userAvatarSrc: '',
			username: 'abc12351',
			userStatus: 'offline',
		},
	]

	const chatList: iChatListItem[] = [
		{
			userAvatarSrc: '',
			username: 'rfelipe-',
			lastMessage: 'test',
		},
		{
			userAvatarSrc: '',
			username: 'cpereira',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'anoliver',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12341',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12342',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12343',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12344',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12345',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12346',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12347',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12348',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12349',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12350',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
		{
			userAvatarSrc: '',
			username: 'abc12351',
			lastMessage:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure magni iste aut dolor vero, dicta commodi omnis fuga aliquid quia quasi consequuntur placeat, autem rerum laudantium perspiciatis? Nihil, nulla accusantium.',
		},
	]

	const activeChatUser = 'rfelipe-'

	const { user } = useContext(UserContext)
	const { closeSocket } = useContext(GameContext)

	useEffect(() => {
		const isAuthenticated = user && !isDateExpired(user?.expiresAt as Date)
		if (!isAuthenticated) {
			closeSocket()
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
						<div className="menuOptions">
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
								activePanel === 'friends' &&
								friendList.map((item: iFriendListItem) => (
									<FriendListItem
										key={item.username}
										userAvatarSrc={item.userAvatarSrc}
										username={item.username}
										userStatus={item.userStatus}
									/>
								))}

							{showSidePanel === true &&
								activePanel === 'chat' &&
								chatList.map((item: iChatListItem) => (
									<ChatListItem
										key={item.username}
										userAvatarSrc={item.userAvatarSrc}
										username={item.username}
										lastMessage={item.lastMessage}
										isActive={
											activeChatUser === item.username
										}
										handleOnClick={() =>
											router.push('/chat')
										}
									/>
								))}
						</div>
					</SidePanelContainer>
				)}
				<PageContainer
					className="pageContainer"
					isSidePanelActive={showSidePanel}
				>
					{children}
				</PageContainer>
			</ApplicationContainer>
		</LayoutContainer>
	) : null
}
