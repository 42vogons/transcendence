import { ReactNode, useEffect, useState } from 'react'
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
import MenuItem from './menuItem'
import { useOutsideClick } from '@/hooks/useOutsideClick'

type activePanelType = 'menu' | 'friends' | 'chat'

interface MenuItemType {
	icon: ReactNode
	title: string
	isActive?: boolean
	handleOnClick?: () => void | undefined
}

interface LayoutProps {
	children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
	const iconSize = 28
	const iconSizeMobile = 24

	const router = useRouter()

	const [currentPath, setCurrentPath] = useState('')
	const [showSidePanel, setShowSidePanel] = useState(false)
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

	const ref = useOutsideClick(closeSidePanel)

	function handleResize() {
		if (window.innerWidth < 1024) {
			setShowSidePanel(false)
			setActivePanel('menu')
		} else {
			setShowSidePanel(true)
			setActivePanel('friends')
		}
	}

	useEffect(() => {
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const menuItems: MenuItemType[] = [
		{
			icon: <FaGamepad size={iconSize} />,
			title: 'Game',
			isActive: false,
			handleOnClick: () => {
				console.log('game')
			},
		},
		{
			icon: <FaUserAstronaut size={iconSize} />,
			title: 'Profile',
			isActive: currentPath.includes('/profile'),
			handleOnClick: () => {
				router.push('/profile')
			},
		},
		{
			icon: <BsChatSquareTextFill size={iconSize} />,
			title: 'Chat',
			isActive: currentPath.includes('/chat'),
			handleOnClick: () => {
				router.push('/chat')
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
			isActive: false,
			handleOnClick: () => {
				console.log('logout')
			},
		},
	]

	return (
		<LayoutContainer>
			<ApplicationContainer>
				<SidebarContainer>
					{menuItems.map((item: MenuItemType) => (
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
				<SidePanelContainer isActive={showSidePanel} ref={ref}>
					{showSidePanel === true && (
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
					)}
					<div className="content">
						{showSidePanel === true &&
							activePanel === 'menu' &&
							menuItems.map((item: MenuItemType) => (
								<MenuItem
									key={item.title}
									title={item.title}
									isActive={item.isActive}
									handleOnClick={item.handleOnClick}
								>
									{item.icon}
								</MenuItem>
							))}
					</div>
				</SidePanelContainer>
				<PageContainer isSidePanelActive={showSidePanel}>
					{children}
				</PageContainer>
			</ApplicationContainer>
		</LayoutContainer>
	)
}
