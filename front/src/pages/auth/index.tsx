import Loading from '@/components/loading'
import { api } from '@/services/api'
import { AuthContainer } from '@/styles/pages/auth'
import Head from 'next/head'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Auth() {
	const router = useRouter()

	const [isLoading, setIsLoading] = useState(false)

	console.log(router.query.code)

	useEffect(() => {
		async function authUser(code: string) {
			setIsLoading(true)
			try {
				const res = await api.post('/auth/user', { code })
				toast('Login was successful', { type: 'success' })
				console.log('res:', res)
				router.push('/profile')
			} catch (error) {
				console.log('error:', error)
				toast('An error occurred during authentication', {
					type: 'error',
				})
				router.push('/login')
				setIsLoading(false)
			}
		}
		const code = router.query.code as string
		console.log('code:', code)
		if (code) {
			authUser(code)
		}
	}, [router])

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
			<AuthContainer>{isLoading && <Loading size={120} />}</AuthContainer>

			<button
				onClick={() => {
					toast('Authenticated', { type: 'success' })
				}}
			>
				Toast
			</button>
		</>
	)
}