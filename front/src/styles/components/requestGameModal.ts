import { styled } from '..'

export const RequestGameModalContainer = styled('div', {
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
	// backgroundColor: 'red',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: 32,
	h3: {
		fontSize: '$2xl',
		textAlign: 'center',

		'@bp2': {
			fontSize: '$3xl',
		},
	},

	'.buttonsContainer': {
		width: '100%',
		display: 'flex',
		flexDirection: 'column-reverse',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 16,

		'@bp2': {
			flexDirection: 'row',
		},
	},
})

export const UserInfo = styled('div', {
	color: '$blue100',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 32,

	h2: {
		fontSize: '$2xl',
		fontFamily: 'monospace',
		fontVariantNnumeric: 'slashed-zero',

		'@bp2': {
			fontSize: '$3xl',
		},
	},
})
