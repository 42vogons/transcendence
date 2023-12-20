import {
	ApplicationContainer,
	LayoutContainer,
	PageContainer,
	SidePanelContainer,
	SidebarContainer,
} from '@/styles/components/layout'
import { ReactNode, useEffect, useState } from 'react'
import { FaGamepad, FaUserAstronaut } from 'react-icons/fa6'
import { FaUserFriends } from 'react-icons/fa'
import { RiLogoutBoxFill } from 'react-icons/ri'
import { BsChatSquareTextFill } from 'react-icons/bs'
import { useRouter } from 'next/router'
import IconButton from './iconButton'

interface LayoutProps {
	children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
	const iconSize = 32

	const router = useRouter()

	const [currentPath, setCurrentPath] = useState('')

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

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
					<IconButton tooltip="Friends">
						<FaUserFriends size={iconSize} />
					</IconButton>
					<IconButton tooltip="Logout">
						<RiLogoutBoxFill size={iconSize} />
					</IconButton>
				</SidebarContainer>
				<SidePanelContainer>friends</SidePanelContainer>
				<PageContainer>{children}</PageContainer>
			</ApplicationContainer>
		</LayoutContainer>
	)
}
