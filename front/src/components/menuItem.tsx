import { MenuItemContainer } from '@/styles/components/menuItem'
import { ReactNode } from 'react'

interface IconButtonProps {
	children: ReactNode
	title: string
	isActive?: boolean
	type?: 'mobile' | 'desktop'
	handleOnClick?: () => void | undefined
}

export default function MenuItem({
	children,
	title,
	isActive,
	handleOnClick,
}: IconButtonProps) {
	return (
		<MenuItemContainer
			isActive={isActive}
			onClick={
				handleOnClick
					? () => {
							handleOnClick()
					  }
					: () => null
			}
		>
			{children}
			<div className="title">{title}</div>
		</MenuItemContainer>
	)
}
