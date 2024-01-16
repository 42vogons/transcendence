import { Ball, CourtContainer, Paddle, Score } from '@/styles/components/game'
import { useEffect, useState } from 'react'

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
	const [player1Y, setPlayer1y] = useState(0)
	const [ball, setBall] = useState<Ball>({
		x: width / 2 - 19,
		y: height / 2 - 8,
		xSpeed: 5,
		ySpeed: 5 * (height / width),
		xDirection: 1,
		yDirection: 1,
	})

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

	const moveBall = (ball: Ball) => {
		const xpos = ball.x + ball.xSpeed * ball.xDirection
		const ypos = ball.y + ball.ySpeed * ball.yDirection

		setBall({ ...ball, x: xpos, y: ypos })
	}

	useEffect(() => {
		const checkCollision = () => {
			if (ball.y > height - 30) {
				setBall({ ...ball, y: height - 30, yDirection: -1 })
			}

			if (ball.y < 0) {
				setBall({ ...ball, y: 0, yDirection: 1 })
			}

			if (ball.x < 0 || ball.x > width - 30) {
				const direction = ball.xDirection * -1
				setBall({
					...ball,
					xDirection: direction,
					x: ball.x + ball.xSpeed * direction,
				})
			}
		}
		const play = setTimeout(() => {
			moveBall(ball)
			checkCollision()
			// console.log(ball)
		}, 1000 / 30)
		return () => clearTimeout(play)
	}, [ball])

	return (
		<CourtContainer css={{ height, width }}>
			<Score>
				<p>
					acarneir <span>7</span>
				</p>
				<p>
					rfelipe- <span>5</span>
				</p>
			</Score>
			<Paddle type={'left'} css={{ top: player1Y }} />
			<Ball css={{ left: ball.x, top: ball.y }} />
			<Paddle type={'right'} />
		</CourtContainer>
	)
}
