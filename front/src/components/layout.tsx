import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FaGamepad, FaUserAstronaut } from 'react-icons/fa6'
import { FaUserFriends } from 'react-icons/fa'
import { BsChatSquareTextFill } from 'react-icons/bs'
import { RiLogoutBoxFill } from 'react-icons/ri'
import { MdOutlineMenu, MdClose } from 'react-icons/md'

import {
	ApplicationContainer,
	LayoutContainer,
	PageContainer,
	SidePanelContainer,
	SidebarContainer,
} from '@/styles/components/layout'
import IconButton from './iconButton'

interface LayoutProps {
	children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
	const iconSize = 28
	const iconSizeMobile = 24

	const router = useRouter()

	const [currentPath, setCurrentPath] = useState('')
	const [showSidePanel, setShowSidePanel] = useState(false)
	const [activePanel, setActivePanel] = useState('friends')

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	function toggleSidePanel() {
		setShowSidePanel((previousState) => !previousState)
	}

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

	return (
		<LayoutContainer>
			<ApplicationContainer>
				<SidebarContainer>
					<IconButton tooltip="Game">
						<FaGamepad size={iconSize} />
					</IconButton>
					<IconButton
						tooltip="Profile"
						isActive={currentPath.includes('/profile')}
						handleOnClick={() => {
							router.push('/profile')
						}}
					>
						<FaUserAstronaut size={iconSize} />
					</IconButton>
					<IconButton
						tooltip="Chat"
						isActive={currentPath.includes('/chat')}
						handleOnClick={() => {
							router.push('/chat')
						}}
					>
						<BsChatSquareTextFill size={iconSize} />
					</IconButton>
					<IconButton
						tooltip="Friends"
						handleOnClick={() => {
							toggleSidePanel()
						}}
					>
						<FaUserFriends size={iconSize} />
					</IconButton>
					<IconButton tooltip="Logout">
						<RiLogoutBoxFill size={iconSize} />
					</IconButton>

					<IconButton
						tooltip="Menu"
						type="mobile"
						handleOnClick={() => {
							toggleSidePanel()
						}}
					>
						<MdOutlineMenu size={iconSizeMobile} />
					</IconButton>
				</SidebarContainer>
				<SidePanelContainer isActive={showSidePanel}>
					<div className="closeIcon">
						<IconButton
							tooltip="Menu"
							type="mobile"
							handleOnClick={() => {
								toggleSidePanel()
							}}
						>
							<MdClose size={iconSizeMobile} />
						</IconButton>
					</div>
					{activePanel}
				</SidePanelContainer>
				<PageContainer isSidePanelActive={showSidePanel}>
					{children}
				</PageContainer>
			</ApplicationContainer>
		</LayoutContainer>
	)
}
