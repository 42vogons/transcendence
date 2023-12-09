import { LoadingContainer } from '@/styles/components/loading'
import Image from 'next/image'

interface LoadingProps {
	size: number
}

export default function Loading({ size }: LoadingProps) {
	return (
		<LoadingContainer>
			<Image
				src="/assets/loading.gif"
				width={size}
				height={size}
				alt="loading..."
				priority={true}
			/>
		</LoadingContainer>
	)
}
