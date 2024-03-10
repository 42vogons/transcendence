import { styled } from '..'

export const EnableTwoFAModalContainer = styled('form', {
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
	gap: 8,
	h2: {
		fontSize: '$2xl',
		color: '$blue100',
		textAlign: 'center',

		'@bp2': {
			fontSize: '$3xl',
		},
	},

	h3: {
		fontSize: '$md',
		textAlign: 'center',
	},

	label: {
		fontSize: '$xl',
		fontWeight: 'bold',
		color: '$gray300',

		'@bp2': {
			fontSize: '$2xl',
		},
	},

	img: {
		border: '1px solid $blue200',
		borderRadius: 16,
	},

	'.buttonsContainer': {
		marginTop: 16,
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
