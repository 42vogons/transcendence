import { Input } from '@/styles/components/TwoFAInput'
import { ChangeEvent, Ref, forwardRef } from 'react'

interface TwoFAInputProps {
	twoFaCode: string
	setTwoFaCode: (state: string) => void
	hasError: boolean
}

const TwoFAInput = forwardRef(
	(
		{ setTwoFaCode, twoFaCode, hasError }: TwoFAInputProps,
		ref: Ref<HTMLInputElement>,
	) => {
		function handleChange(e: ChangeEvent<HTMLInputElement>) {
			const input = e.target.value.replace(/\D/g, '')
			setTwoFaCode(input)
		}

		return (
			<Input
				ref={ref}
				id="2fa"
				type="text"
				maxLength={6}
				minLength={6}
				pattern="[0-9]*"
				inputMode="numeric"
				onChange={handleChange}
				value={twoFaCode}
				hasError={hasError}
			/>
		)
	},
)

TwoFAInput.displayName = 'TwoFAInput'

export default TwoFAInput
