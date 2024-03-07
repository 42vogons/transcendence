import { styled } from '..'

export const MuteChannelUserModalContainer = styled('div', {
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

	label: {
		fontSize: '$xl',
		textAlign: 'center',
		color: '$gray300',

		'@bp2': {
			fontSize: '$2xl',
		},
	},

	'input,select': {
		margin: '0 auto',
		width: '98%',
		borderRadius: '16px',
		border: '2px solid $gray300',
		fontSize: '$xl',
		padding: '8px 14px',
		'&:focus::placeholder': {
			color: 'transparent',
		},
		textAlign: 'center',

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
		flexDirection: 'column-reverse',
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
		alignItems: 'center',
		gap: 8,
		textAlign: 'center',
		fontWeight: 'bold',

		span: {
			color: '$red',
		},

		'@bp2': {
			fontSize: '$xl',
		},
	},
})

export const ChannelInputContainer = styled('div', {
	position: 'relative',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	borderRadius: 16,

	'input,select': {
		padding: '8px 14px 8px 50px !important',
	},

	variants: {
		hasOption: {
			true: {
				input: {
					borderRadius: '16px 16px  0 0 ',
					borderBottom: '2px solid $gray300',
				},
			},
		},
	},

	'.icon': {
		position: 'absolute',
		top: 8,
		left: 20,

		'@bp2': {
			top: 12,
			left: 20,
		},
	},
})
