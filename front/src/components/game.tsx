import { CourtContainer, Paddle } from '@/styles/components/game'
import { useEffect, useState } from 'react'

export default function Game() {
	const [player1Y, setPlayer1y] = useState(0)
	useEffect(() => {
		const sendKeyEvent = (e: KeyboardEvent) => {
			const { key, type } = e

			switch (key) {
				case 'ArrowUp':
					setPlayer1y((previous) =>
						previous >= 100 ? previous - 30 : 0,
					)
					e.preventDefault()
					break
				case 'ArrowDown':
					setPlayer1y((previous) =>
						previous + 30 < 350 ? previous + 30 : 350,
					)
					e.preventDefault()
					break
				default:
					break
			}
		}

		document.addEventListener('keydown', sendKeyEvent)
		document.addEventListener('keyup', sendKeyEvent)

		return () => {
			document.removeEventListener('keydown', sendKeyEvent)
			document.removeEventListener('keyup', sendKeyEvent)
		}
	}, [])

	return (
		<CourtContainer>
			<Paddle type={'left'} css={{ top: player1Y }} />
			<Paddle type={'right'} />
		</CourtContainer>
	)
}
