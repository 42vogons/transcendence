import { IconButtonContainer } from '@/styles/components/iconButton'
import { ReactNode } from 'react'

interface IconButtonProps {
	children: ReactNode
	title: string
	isActive?: boolean
	type?: 'mobile' | 'desktop'
	handleOnClick?: () => void | undefined
}

export default function IconButton({
	children,
	title,
	isActive,
	type,
	handleOnClick,
}: IconButtonProps) {
	return (
		<IconButtonContainer
			isActive={isActive}
			type={type || 'desktop'}
			onClick={
				handleOnClick
					? () => {
							handleOnClick()
					  }
					: () => null
			}
		>
			{children}
			<div className="tooltip">{title}</div>
		</IconButtonContainer>
	)
}
