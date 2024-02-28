import { styled } from '..'

export const RequestGameModalContainer = styled('div', {
	height: '100%',
	width: '100%',
	// backgroundColor: 'red',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: 64,
	h3: {
		fontSize: '$3xl',
		// color: '$blue100',
		textAlign: 'center',
	},

	'.buttonsContainer': {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
})

export const UserInfo = styled('div', {
	color: '$blue100',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 32,

	h2: {
		fontSize: '48px',
		fontFamily: 'monospace',
		fontVariantNnumeric: 'slashed-zero',
	},
})
