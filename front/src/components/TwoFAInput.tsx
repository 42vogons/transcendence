import { TwoFAForm } from '@/styles/components/twoFaInput'
import { FormEvent, useState } from 'react'

interface TwoFAInputProps {
	sendTwoFA: (value: string) => void
}

export default function TwoFAInput({ sendTwoFA }: TwoFAInputProps) {
	const [value, setValue] = useState('')
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		console.log('2fa: ', value)
		if (value) {
			sendTwoFA(value)
		}
	}
	return (
		<TwoFAForm onSubmit={handleSubmit}>
			<label htmlFor="2fa">2FA code</label>
			<input
				id="2fa"
				type="number"
				max={999999}
				onChange={(e) => setValue(e.target.value)}
				value={value}
			/>
			<button>Send</button>
		</TwoFAForm>
	)
}
