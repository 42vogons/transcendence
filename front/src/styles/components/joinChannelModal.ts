import { styled } from '..'

export const JoinChannelModalContainer = styled('div', {
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
		width: '98%',
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

export const ChannelList = styled('ul', {
	position: 'absolute',
	top: 48,
	maxHeight: 140,
	width: '98%',
	overflowY: 'auto',
	border: '1px solid $gray300',
	borderTop: 'none',
	borderRadius: '0 0 16px 16px ',
	backgroundColor: '$white',

	'&::-webkit-scrollbar': {
		width: 4,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$blue100',
	},

	'@bp2': {
		top: 56,
	},
})

export const ChannelListItem = styled('li', {
	display: 'flex',
	alignItems: 'center',
	gap: 4,
	borderBottom: '1px solid $gray300',
	padding: '8px 14px 8px 14px',

	cursor: 'pointer',
	transition: 'all 0.2s',

	'&:hover': {
		background: '$blue200',
		color: '$white',
	},

	'&:last-of-type': {
		borderBottom: 'none',
		borderRadius: '0 0 0 16px',
	},
})

export const LoadingContainer = styled('div', {
	paddingTop: 8,
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 16,
	fontSize: '$xl',

	'@bp2': {
		fontSize: '$2xl',
	},
})

export const ChannelAvatarContainer = styled('div', {
	position: 'relative',
	borderRadius: '50%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	background: 'transparent',

	img: {
		borderRadius: '50%',
		border: '1px solid transparent',
	},
})

export const ChannelName = styled('p', {
	fontSize: '$xl',

	'@bp2': {
		fontSize: '$2xl',
	},
})
