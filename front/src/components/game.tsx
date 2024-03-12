import { GameContext } from '@/contexts/GameContext'
import { Ball, CourtContainer, Paddle, Score } from '@/styles/components/game'
import { useContext, useEffect, useState } from 'react'

interface Ball {
	x: number
	y: number
	xSpeed: number
	ySpeed: number
	xDirection: number
	yDirection: number
}

export default function Game() {
	const { match, sendKey, containerWidth, containerHeight, courtColor } =
		useContext(GameContext)

	const [width, setWidth] = useState(928)
	const [height, setHeight] = useState(458)

	function getScoreDistance() {
		if (width >= 900) {
			return Math.round(-0.1 * height)
		} else if (width >= 400) {
			return Math.round(-0.2 * height)
		} else {
			return Math.round(-0.3 * height)
		}
	}

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

	useEffect(() => {
		if (containerWidth > containerHeight) {
			if (containerHeight > 1000) {
				setWidth(928)
				setHeight(458)
			} else {
				setWidth(Math.round(0.7 * containerHeight) + 8)
				setHeight(Math.round((0.7 * containerHeight * 450) / 920) + 8)
			}
		} else {
			if (containerWidth > 1000) {
				setWidth(928)
				setHeight(458)
			} else {
				if (containerWidth >= 320) {
					setWidth(Math.round(0.8 * containerWidth) + 8)
					setHeight(
						Math.round((0.8 * containerWidth * 450) / 920) + 8,
					)
				} else {
					setWidth(Math.round(0.7 * containerWidth) + 8)
					setHeight(
						Math.round((0.7 * containerWidth * 450) / 920) + 8,
					)
				}
			}
		}
	}, [containerWidth, containerHeight])

	return (
		<CourtContainer
			css={{
				height,
				width,
				backgroundColor: courtColor,
				borderRadius: width >= 928 ? 24 : width >= 400 ? 16 : 0,
			}}
		>
			<Score
				playerType={'first'}
				gameSize={width >= 400 ? 'l' : 's'}
				css={{ color: courtColor, top: getScoreDistance() }}
			>
				<p>
					{match?.player1?.username} <span>{match?.score?.p1}</span>
				</p>
			</Score>

			<Score
				playerType={'second'}
				gameSize={width >= 400 ? 'l' : 's'}
				css={{
					color: courtColor,
					bottom: getScoreDistance() - (width >= 400 ? 52 : 36),
				}}
			>
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
