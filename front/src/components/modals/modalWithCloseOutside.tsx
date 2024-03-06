import { ModalContainer, ModalContent } from '@/styles/components/modal'
import { ReactNode, useEffect, useRef } from 'react'

interface iModalWithCloseOutsideProps {
	isOpen: boolean
	setIsOpen: (value: boolean) => void
	children: ReactNode
}

export default function ModalWithCloseOutside({
	isOpen,
	setIsOpen,
	children,
}: iModalWithCloseOutsideProps) {
	const ref = useRef(null)

	useEffect(() => {
		if (isOpen) {
			const handleClickOutside = (event: Event) => {
				if (
					ref.current &&
					!(ref.current as HTMLElement).contains(
						event.target as HTMLElement,
					)
				) {
					setIsOpen && setIsOpen(false)
				}
			}
			document.addEventListener('click', handleClickOutside, true)
			return () => {
				document.removeEventListener('click', handleClickOutside, true)
			}
		}
	}, [isOpen, setIsOpen])

	return isOpen ? (
		<ModalContainer>
			<ModalContent ref={ref}>{children}</ModalContent>
		</ModalContainer>
	) : null
}
