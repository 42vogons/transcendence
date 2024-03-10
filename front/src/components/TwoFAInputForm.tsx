import { TwoFAForm } from '@/styles/components/TwoFAInputForm'
import { FormEvent, useRef, useState } from 'react'
import TwoFAInput from './TwoFAInput'

interface TwoFAInputFormProps {
	sendTwoFA: (value: string) => void
}

export default function TwoFAInputForm({ sendTwoFA }: TwoFAInputFormProps) {
	const [value, setValue] = useState('')

	const codeInput = useRef(null)
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
			<TwoFAInput
				ref={codeInput}
				setTwoFaCode={setValue}
				twoFaCode={value}
			/>
			<button>Send</button>
		</TwoFAForm>
	)
}