import { TwoFAForm } from '@/styles/components/TwoFAInputForm'
import { FormEvent, useRef, useState } from 'react'
import TwoFAInput from './TwoFAInput'
import Button from './button'
import { MdCheck } from 'react-icons/md'

interface TwoFAInputFormProps {
	sendTwoFA: (value: string) => void
}

export default function TwoFAInputForm({ sendTwoFA }: TwoFAInputFormProps) {
	const [value, setValue] = useState('')

	const codeInput = useRef(null)
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
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
			<Button buttonType="accept" disabled={value.length !== 6}>
				<MdCheck size={40} />
				Send
			</Button>
		</TwoFAForm>
	)
}
