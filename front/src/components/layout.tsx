import {
	ApplicationContainer,
	LayoutContainer,
	PageContainer,
	SidePanelContainer,
	SidebarContainer,
} from '@/styles/components/layout'
import { ReactNode } from 'react'

interface LayoutProps {
	children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
	return (
		<LayoutContainer>
			<ApplicationContainer>
				<SidebarContainer>teste</SidebarContainer>
				<SidePanelContainer>friends</SidePanelContainer>
				<PageContainer>{children}</PageContainer>
			</ApplicationContainer>
		</LayoutContainer>
	)
}
