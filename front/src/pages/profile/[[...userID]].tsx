import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'

import {
	LoadingContainer,
	MatchCardsContainer,
	MatchHistoryContainer,
	MessageContainer,
	PageContainer,
	ProfileContainer,
	ProfileDataContainer,
	ProfileImageContainer,
	TitleContainer,
} from '@/styles/pages/profile'

import { FaUserAstronaut } from 'react-icons/fa6'
import { MdViewList } from 'react-icons/md'
import Stats from '@/components/stats'
import MatchCard from '@/components/matchCard'

import userDefaulAvatar from '../../../public/assets/user.png'
import Layout from '@/components/layout'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { api } from '@/services/api'
import { toast } from 'react-toastify'
import Loading from '@/components/loading'
import { UserContext } from '@/contexts/UserContext'

interface Player {
	userID: number
	username: string
	score: number
}

interface ProfileData {
	user_id: number
	username: string
	avatar_url: string
	total_games: number
	total_losses: number
	total_wins: number
}

interface MatchHistoryData {
	endedAt: Date
	id: number
	looserID: number
	player1: Player
	player2: Player
	winnerID: number
}

export default function Profile() {
	const router = useRouter()
	const { user } = useContext(UserContext)
	const [isLoading, setIsLoading] = useState(true)

	const [profileData, setProfileData] = useState<ProfileData | undefined>(
		undefined,
	)
	const [matchHistoryData, setMatchHistoryData] = useState<
		MatchHistoryData[] | undefined
	>(undefined)

	async function getUserData(userID: number) {
		setIsLoading(true)
		try {
			const { data: userData } = await api.get(
				`/users/findUsersByUserID/${userID}`,
			)
			setProfileData(userData)
			const { data: matchData } = await api.get(
				`/game/match_history/${userID}`,
			)
			setMatchHistoryData(matchData)
			setIsLoading(false)
		} catch (error: any) {
			console.log('error:', error)
			setProfileData(undefined)
			setMatchHistoryData(undefined)
			setIsLoading(false)
			toast('Invalid user id', {
				type: 'error',
			})
		}
	}

	const { userID } = router.query
	useEffect(() => {
		if (router.isReady) {
			if (isNaN(Number(userID)) && typeof userID === 'undefined') {
				getUserData(Number(user?.userID))
			} else if (
				typeof userID !== 'undefined' &&
				!isNaN(Number(userID))
			) {
				getUserData(Number(userID))
			} else {
				setIsLoading(false)
				toast('Invalid user id', {
					type: 'error',
				})
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userID, router.isReady])

	return (
		<>
			<Head>
				<title>Transcendence - Pong</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{profileData && matchHistoryData ? (
				<PageContainer>
					<ProfileDataContainer>
						<ProfileContainer>
							<ProfileImageContainer>
								<Image
									src={
										profileData?.avatar_url ||
										userDefaulAvatar.src
									}
									width={180}
									height={180}
									alt="user"
									placeholder="blur"
									blurDataURL={userDefaulAvatar.src}
								/>
							</ProfileImageContainer>
							<TitleContainer>
								<FaUserAstronaut size={40} />
								<h2>{profileData?.username}</h2>
							</TitleContainer>
						</ProfileContainer>
						<Stats
							total_games={profileData?.total_games}
							total_wins={profileData?.total_wins}
						/>
					</ProfileDataContainer>
					<MatchHistoryContainer>
						<TitleContainer>
							<MdViewList size={56} />
							<h2>Match History</h2>
						</TitleContainer>
						<MatchCardsContainer>
							{matchHistoryData.map((match: MatchHistoryData) => (
								<MatchCard
									key={match.id}
									players={[match.player1, match.player2]}
									winnerID={match.winnerID}
								/>
							))}
						</MatchCardsContainer>
					</MatchHistoryContainer>
				</PageContainer>
			) : !router.isReady ? (
				<LoadingContainer>
					<Loading size={200} />
				</LoadingContainer>
			) : isLoading ? (
				<LoadingContainer>
					<Loading size={200} />
				</LoadingContainer>
			) : (
				<MessageContainer>
					<h2>User not found</h2>
				</MessageContainer>
			)}
		</>
	)
}

Profile.getLayout = (page: ReactElement) => {
	return <Layout>{page}</Layout>
}
