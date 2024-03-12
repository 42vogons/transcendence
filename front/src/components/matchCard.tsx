import Image from 'next/image'

import {
	Card,
	MatchCardContainer,
	MatchTimestamp,
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
	avatarUrl: string
}

export interface MatchProps {
	players: iPlayer[]
	winnerID: number
	timestamp: Date
}

export default function MatchCard({
	players,
	winnerID,
	timestamp,
}: MatchProps) {
	const router = useRouter()
	const imgSize = 100

	const player1 = players[0]
	const player2 = players[1]

	function handleOnClick(userID: number) {
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
							src={player1.avatarUrl || userDefaulAvatar}
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
							src={player2.avatarUrl || userDefaulAvatar}
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
			<MatchTimestamp>
				{`@ ${new Date(timestamp)
					.toLocaleString('en-CA', {
						hourCycle: 'h23',
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit',
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
					})
					.replace(',', ' ')}`}
			</MatchTimestamp>
		</MatchCardContainer>
	)
}
