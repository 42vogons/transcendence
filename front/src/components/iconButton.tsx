import { IconButtonContainer } from '@/styles/components/iconButton'
import { ReactNode } from 'react'

interface IconButtonProps {
	children: ReactNode
	tooltip: string
	isActive?: boolean
	handleOnClick?: () => void | undefined
}

export default function IconButton({
	children,
	tooltip,
	isActive,
	handleOnClick,
}: IconButtonProps) {
	return (
		<IconButtonContainer
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
			<div className="tooltip">{tooltip}</div>
		</IconButtonContainer>
	)
}
