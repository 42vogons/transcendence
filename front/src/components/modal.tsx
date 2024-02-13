import { ModalContainer, ModalContent } from '@/styles/components/modal'
import { ReactNode } from 'react'

interface iModalProps {
	isOpen: boolean
	children: ReactNode
}

export default function Modal({ isOpen, children }: iModalProps) {
	return isOpen ? (
		<ModalContainer>
			<ModalContent>{children}</ModalContent>
		</ModalContainer>
	) : null
}
