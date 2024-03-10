import { Input } from '@/styles/components/TwoFAInput'
import { ChangeEvent } from 'react'

interface TwoFAInputProps {
	twoFaCode: string
	setTwoFaCode: (state: string) => void
}

export default function TwoFAInput({
	setTwoFaCode,
	twoFaCode,
}: TwoFAInputProps) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const input = e.target.value.replace(/\D/g, '')
		setTwoFaCode(input)
	}
	return (
		<Input
			id="2fa"
			type="text"
			maxLength={6}
			minLength={6}
			pattern="[0-9]*"
			inputMode="numeric"
			onChange={handleChange}
			value={twoFaCode}
		/>
	)
}
