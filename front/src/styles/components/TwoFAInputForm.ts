import { styled } from '..'

export const TwoFAForm = styled('form', {
	width: 400,
	height: '60%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
	alignItems: 'center',
	gap: 16,
	backgroundColor: '$white',
	borderRadius: 32,
	// border: '2px solid $gray300',

	label: {
		fontSize: '$3xl',
		color: '$blue100',
		fontWeight: 'bold',
	},

	input: {
		width: '80%',
		borderRadius: 16,
		border: '2px solid $gray300',
		fontSize: '$2xl',
		// color: '$blue100',
		textAlign: 'center',
		padding: '0.5rem 1rem',
	},

	button: {
		margin: '2rem 0 1rem',
		backgroundColor: '$green500',
		color: '$white',
		fontSize: '$2xl',
		padding: '0.5rem 1rem',
		borderRadius: 32,
		border: '4px solid transparent',
		cursor: 'pointer',
		transition: '0.2s',

		'&:hover': {
			backgroundColor: '$white',
			color: '$green300',
			border: '4px solid $green300',
		},
	},
})
