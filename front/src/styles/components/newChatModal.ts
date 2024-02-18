import { styled } from '..'

export const NewChatModalContainer = styled('div', {
	height: '100%',
	width: '100%',
	// backgroundColor: 'red',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 64,
	h2: {
		fontSize: '$3xl',
		color: '$blue100',
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
