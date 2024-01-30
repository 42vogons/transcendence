import type { AppProps } from 'next/app'
import { globalStyles } from '@/styles/global'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import { GameProvider } from '@/contexts/GameContext'

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
			<GameProvider>
				{getLayout(<Component {...pageProps} />)}
			</GameProvider>
			<ToastContainer theme="colored" />
		</>
	)
}
