import { styled } from '..'

export const Input = styled('input', {
	outline: 'none',
	width: 200,
	borderRadius: 16,
	border: '2px solid $gray300',
	fontSize: '$2xl',
	fontFamily: 'monospace',
	letterSpacing: 8,
	textAlign: 'center',
	padding: '0.5rem 1rem',

	variants: {
		hasError: {
			true: {
				borderColor: '$red',
			},
		},
	},
})
