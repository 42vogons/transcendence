import Head from 'next/head'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { FaGamepad } from 'react-icons/fa6'

import {
	HomeContainer,
	LoadingContainer,
	PlayButton,
} from '@/styles/pages/home'
import Layout from '@/components/layout'
import Game from '@/components/game'
import { GameContext } from '@/contexts/GameContext'
import Loading from '@/components/loading'

export default function Home() {
	const { status, joinQueue, exitQueue, playing } = useContext(GameContext)

	const [userID, setUserID] = useState('')

	function getPlayerInfo() {
		let user = localStorage.getItem('@42Transcendence:user')
		if (!user) {
			user = new Date().toLocaleString()
			localStorage.setItem('@42Transcendence:user', JSON.stringify(user))
		}
		return user
	}

	useEffect(() => {
		setUserID(getPlayerInfo())
	}, [])

	useEffect(() => {
		console.log('userID:', userID)
	}, [userID])

	useEffect(() => {
		console.log('GameStatus:', status)
	}, [status])
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
			<HomeContainer>
				{status === 'connected' && (
					<PlayButton
						onClick={() => {
							joinQueue(userID)
							console.log('userID:', userID)
						}}
					>
						<FaGamepad size={40} />
						Play
					</PlayButton>
				)}
				{status === 'searching' && (
					<LoadingContainer>
						<Loading size={200} />
						<h3>Looking for a match...</h3>
						<button onMouseUp={() => exitQueue()}>Cancel</button>
					</LoadingContainer>
				)}

				{status === 'readyToPlay' && (
					<LoadingContainer>
						{/* <Loading size={200} /> */}
						<h3>Ready?</h3>
						<button onMouseUp={() => playing()}>Ready</button>
					</LoadingContainer>
				)}
				{status === 'playing' && <Game />}
			</HomeContainer>
		</>
	)
}

Home.getLayout = (page: ReactElement) => {
	return <Layout>{page}</Layout>
}
