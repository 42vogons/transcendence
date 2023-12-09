import type { AppProps } from 'next/app'
import { globalStyles } from '@/styles/global'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Component {...pageProps} />
			<ToastContainer theme="colored" />
		</>
	)
}
