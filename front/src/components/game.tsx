import { GameContext } from '@/contexts/GameContext'
import { Ball, CourtContainer, Paddle, Score } from '@/styles/components/game'
import { useContext, useEffect } from 'react'

interface Ball {
	x: number
	y: number
	xSpeed: number
	ySpeed: number
	xDirection: number
	yDirection: number
}

export default function Game() {
	const height = 458
	const width = 928
	const { match, sendKey } = useContext(GameContext)

	useEffect(() => {
		const sendKeyEvent = (e: KeyboardEvent) => {
			const { key, type } = e

			switch (key) {
				case 'ArrowUp':
					sendKey(type, key)
					e.preventDefault()
					break
				case 'ArrowDown':
					sendKey(type, key)
					e.preventDefault()
					break
				case 'p':
					sendKey(type, key)
					e.preventDefault()
					break
				case 'P':
					sendKey(type, key)
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
	}, [sendKey])

	return (
		<CourtContainer css={{ height, width }}>
			<Score>
				<p>
					{match?.player1?.username} <span>{match?.score?.p1}</span>
				</p>
				<p>
					{match?.player2?.username} <span>{match?.score?.p2}</span>
				</p>
			</Score>
			<Paddle
				css={{
					left:
						(match?.player1?.position.x / match?.court?.width) *
						width,
					top:
						(match?.player1?.position.y / match?.court?.height) *
						height,
					width:
						(match?.player1?.width / match?.court?.width) * width,
					height:
						(match?.player1?.height / match?.court?.height) *
						height,
				}}
			/>
			<Ball
				css={{
					left:
						(match?.ball?.position.x / match?.court?.width) * width,
					top:
						(match?.ball?.position.y / match?.court?.height) *
						height,
					width:
						(match?.ball?.radius / match?.court?.width) * 2 * width,
					height:
						(match?.ball?.radius / match?.court?.width) * 2 * width,
				}}
			/>
			<Paddle
				css={{
					left:
						(match?.player2?.position.x / match?.court?.width) *
						width,
					top:
						(match?.player2?.position.y / match?.court?.height) *
						height,
					width:
						(match?.player2?.width / match?.court?.width) * width,
					height:
						(match?.player2?.height / match?.court?.height) *
						height,
				}}
			/>
		</CourtContainer>
	)
}
