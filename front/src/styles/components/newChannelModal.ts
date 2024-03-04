import { styled } from '..'

export const NewChannelModalForm = styled('form', {
	overflowY: 'auto',

	'&::-webkit-scrollbar': {
		width: 4,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$blue100',
	},
	height: '100%',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: 32,

	h2: {
		fontSize: '$2xl',
		color: '$blue100',
		textAlign: 'center',

		'@bp2': {
			fontSize: '$3xl',
		},
	},

	'input,select': {
		// outline: 'none',
		width: '100%',
		borderRadius: '16px',
		border: '2px solid $gray300',
		fontSize: '$xl',
		padding: '8px 14px',
		'&:focus::placeholder': {
			color: 'transparent',
		},

		'@bp2': {
			fontSize: '$2xl',
		},
	},

	'.hasError': {
		border: '2px solid $red !important',
	},

	'.buttonsContainer': {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 16,

		'@bp2': {
			flexDirection: 'row',
		},
	},

	'.inputContainer': {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: 8,
		textAlign: 'center',
		color: '$red',
		fontWeight: 'bold',

		'@bp2': {
			fontSize: '$xl',
		},
	},
})
