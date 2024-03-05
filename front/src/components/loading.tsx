import { LoadingContainer } from '@/styles/components/loading'
import Image from 'next/image'

interface iLoadingProps {
	size: number
}

export default function Loading({ size }: iLoadingProps) {
	return (
		<LoadingContainer>
			<Image
				src="/assets/loading.gif"
				width={size}
				height={size}
				alt="loading..."
			/>
		</LoadingContainer>
	)
}
