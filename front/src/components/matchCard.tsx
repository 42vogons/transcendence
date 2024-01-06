import Image from 'next/image'

import {
	Card,
	MatchCardContainer,
	Score,
	UserContainer,
	UserImageContainer,
	UsernameContainer,
} from '@/styles/components/matchCard'

import { FaUserAstronaut } from 'react-icons/fa6'

interface player {
	username: string
	score: number
	winner?: boolean
}

export interface MatchProps {
	players: player[]
}

export default function MatchCard({ players }: MatchProps) {
	const imgSize = 100

	const player1 = players[0]
	const player2 = players[1]

	if (player1.score > player2.score) {
		player1.winner = true
		player2.winner = false
	} else {
		player2.winner = true
		player1.winner = false
	}
	return (
		<MatchCardContainer>
			<Card isWinner={player1.winner}>
				<UserContainer>
					<UserImageContainer>
						<Image
							src="/assets/user.png"
							width={imgSize}
							height={imgSize}
							priority
							alt="user"
						/>
					</UserImageContainer>
					<UsernameContainer>
						<FaUserAstronaut size={32} />
						<h2>{player1.username}</h2>
					</UsernameContainer>
				</UserContainer>
				<Score>{player1.score}</Score>
			</Card>
			<span>X</span>
			<Card isWinner={player2.winner}>
				<UserContainer>
					<UserImageContainer>
						<Image
							src="/assets/user.png"
							width={imgSize}
							height={imgSize}
							priority
							alt="user"
						/>
					</UserImageContainer>
					<UsernameContainer>
						<FaUserAstronaut size={32} />
						<h2>{player2.username}</h2>
					</UsernameContainer>
				</UserContainer>

				<Score>{player2.score}</Score>
			</Card>
		</MatchCardContainer>
	)
}
