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
import userDefaulAvatar from '../../public/assets/user.png'
import { useRouter } from 'next/router'

interface iPlayer {
	userID: number
	username: string
	score: number
}

export interface MatchProps {
	players: iPlayer[]
	winnerID: number
}

export default function MatchCard({ players, winnerID }: MatchProps) {
	const router = useRouter()
	const imgSize = 100

	const player1 = players[0]
	const player2 = players[1]

	function handleOnClick(userID: number) {
		console.log('click userID:', userID)
		router.push('/profile/' + userID)
	}

	return (
		<MatchCardContainer>
			<Card
				isWinner={player1.userID === winnerID}
				onClick={() => handleOnClick(player1.userID)}
			>
				<UserContainer>
					<UserImageContainer>
						<Image
							src={userDefaulAvatar}
							width={imgSize}
							height={imgSize}
							alt="user"
							placeholder="blur"
							blurDataURL={userDefaulAvatar.src}
						/>
					</UserImageContainer>
					<UsernameContainer className="user">
						<FaUserAstronaut size={32} />
						<h2>{player1.username}</h2>
					</UsernameContainer>
				</UserContainer>
				<Score>{player1.score}</Score>
			</Card>
			<span>X</span>
			<Card
				isWinner={player2.userID === winnerID}
				onClick={() => handleOnClick(player2.userID)}
			>
				<UserContainer>
					<UserImageContainer>
						<Image
							src={userDefaulAvatar}
							width={imgSize}
							height={imgSize}
							alt="user"
							placeholder="blur"
							blurDataURL={userDefaulAvatar.src}
						/>
					</UserImageContainer>
					<UsernameContainer className="user">
						<FaUserAstronaut size={32} />
						<h2>{player2.username}</h2>
					</UsernameContainer>
				</UserContainer>

				<Score>{player2.score}</Score>
			</Card>
		</MatchCardContainer>
	)
}
