import { ButtonContainer } from '@/styles/components/button'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

interface iButtonProps extends ComponentPropsWithoutRef<'button'> {
	buttonType?: 'accept' | 'cancel' | 'default'
	children: ReactNode
}
export default function Button({
	children,
	buttonType = 'default',
	...rest
}: iButtonProps) {
	return (
		<ButtonContainer buttonType={buttonType} {...rest}>
			{children}
		</ButtonContainer>
	)
}
