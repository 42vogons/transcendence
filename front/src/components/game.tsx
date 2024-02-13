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
	// const [player1Y, setPlayer1y] = useState(0)
	// const [ball, setBall] = useState<Ball>({
	// 	x: width / 2 - 19,
	// 	y: height / 2 - 8,
	// 	xSpeed: 5,
	// 	ySpeed: 5 * (height / width),
	// 	xDirection: 1,
	// 	yDirection: 1,
	// })

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

	// const moveBall = (ball: Ball) => {
	// 	const xpos = ball.x + ball.xSpeed * ball.xDirection
	// 	const ypos = ball.y + ball.ySpeed * ball.yDirection

	// 	setBall({ ...ball, x: xpos, y: ypos })
	// }

	// useEffect(() => {
	// 	const checkCollision = () => {
	// 		if (ball.y > height - 30) {
	// 			setBall({ ...ball, y: height - 30, yDirection: -1 })
	// 		}

	// 		if (ball.y < 0) {
	// 			setBall({ ...ball, y: 0, yDirection: 1 })
	// 		}

	// 		if (ball.x < 0 || ball.x > width - 30) {
	// 			const direction = ball.xDirection * -1
	// 			setBall({
	// 				...ball,
	// 				xDirection: direction,
	// 				x: ball.x + ball.xSpeed * direction,
	// 			})
	// 		}
	// 	}
	// 	const play = setTimeout(() => {
	// 		moveBall(ball)
	// 		checkCollision()
	// 		// console.log(ball)
	// 	}, 1000 / 60)
	// 	return () => clearTimeout(play)
	// }, [ball])

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
