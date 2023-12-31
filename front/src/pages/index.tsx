import Head from 'next/head'
import Link from 'next/link'

import { HomeContainer } from '@/styles/pages/home'

export default function Home() {
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
				<p>Hello word</p>
				<Link href="/login">Login</Link>
			</HomeContainer>
		</>
	)
}
