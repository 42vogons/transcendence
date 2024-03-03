import { Container } from '@/styles/components/messageContainer'
import { ReactNode } from 'react'

interface MessageContainerProps {
	children: ReactNode
}
export default function MessageContainer({ children }: MessageContainerProps) {
	return <Container>{children}</Container>
}
