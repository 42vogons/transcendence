import { MenuListItemContainer } from '@/styles/components/menuListItem'
import { ReactNode } from 'react'

interface iMenuListItemProps {
	children: ReactNode
	title: string
	isActive?: boolean
	type?: 'mobile' | 'desktop'
	handleOnClick?: () => void | undefined
}

export default function MenuListItem({
	children,
	title,
	isActive,
	handleOnClick,
}: iMenuListItemProps) {
	return (
		<MenuListItemContainer
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
		</MenuListItemContainer>
	)
}
