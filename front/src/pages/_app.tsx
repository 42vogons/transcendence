import type { AppProps } from 'next/app'
import { globalStyles } from '@/styles/global'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import { GameProvider } from '@/contexts/GameContext'
import { UserProvider } from '@/contexts/UserContext'
import { ChatProvider } from '@/contexts/ChatContext'
import RequestGameModal from '@/components/requestGameModal'

globalStyles()

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page)
	return (
		<>
			<UserProvider>
				<ChatProvider>
					<GameProvider>
						{getLayout(<Component {...pageProps} />)}
						<RequestGameModal />
					</GameProvider>
				</ChatProvider>
			</UserProvider>
			<ToastContainer theme="colored" />
		</>
	)
}
