import { styled } from '..'

export const NewChannelModalContainer = styled('div', {
	height: '100%',
	width: '100%',
	// backgroundColor: 'red',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: 64,

	h2: {
		fontSize: '$3xl',
		color: '$blue100',
		textAlign: 'center',
	},

	'input,select': {
		width: '100%',
		borderRadius: '16px',
		border: '2px solid $gray300',
		fontSize: '$2xl',
		padding: '8px 14px',
		'&:focus::placeholder': {
			color: 'transparent',
		},
	},

	'.buttonsContainer': {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
})
