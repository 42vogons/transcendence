import { IconButtonContainer } from '@/styles/components/iconButton'
import { ReactNode } from 'react'

interface IconButtonProps {
	children: ReactNode
	tooltip: string
	isActive?: boolean
	type?: 'mobile' | 'desktop'
	handleOnClick?: () => void | undefined
}

export default function IconButton({
	children,
	tooltip,
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
			<div className="tooltip">{tooltip}</div>
		</IconButtonContainer>
	)
}
