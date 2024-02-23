import { IconButtonContainer } from '@/styles/components/iconButton'
import { ReactNode } from 'react'

interface iIconButtonProps {
	children: ReactNode
	title?: string
	isActive?: boolean
	type?: 'mobile' | 'desktop' | 'default'
	handleOnClick?: () => void | undefined
}

export default function IconButton({
	children,
	title,
	isActive,
	type = 'default',
	handleOnClick,
}: iIconButtonProps) {
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
			{title && <div className="tooltip">{title}</div>}
		</IconButtonContainer>
	)
}
