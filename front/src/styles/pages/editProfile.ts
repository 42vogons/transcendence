import { styled } from '..'
import * as Switch from '@radix-ui/react-switch'

export const LoadingContainer = styled('main', {
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '$blue800',
})

export const EditProfileWrapper = styled('div', {
	height: '100%',
	width: '100%',
	borderRadius: '0 32px 32px 0',
	backgroundColor: '$blue800',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
})

export const EditProfileContainer = styled('div', {
	height: 800,
	width: 540,
	maxHeight: '86vh',
	maxWidth: '74vw',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 48,
	justifyContent: 'space-between',
	borderRadius: 16,
	backgroundColor: '$white',

	h2: {
		marginTop: 32,
		fontSize: '$2xl',
		color: '$blue100',
		textAlign: 'center',

		'@bp2': {
			fontSize: '$3xl',
		},
	},

	overflowY: 'auto',

	'&::-webkit-scrollbar': {
		width: 4,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$blue100',
	},
})

export const EditProfileImageContainer = styled('button', {
	position: 'relative',
	border: '2px solid transparent',
	borderRadius: 16,
	padding: 8,
	cursor: 'pointer',
	background: 'transparent',
	transition: '0.2s',

	img: {
		borderRadius: '50%',
		border: '4px solid $white',
	},

	'&:hover': {
		border: '2px solid $blue100',

		'.icon': {
			backgroundColor: '$blue100',
		},
	},

	'.icon': {
		transition: '0.2s',
		position: 'absolute',
		bottom: 23,
		right: 23,
		backgroundColor: '$blue200',
		color: '$white',
		padding: 8,
		borderRadius: 14,
		border: '2px solid $white',
	},

	'@bp2': {
		padding: 16,
	},
})

export const InputContainer = styled('form', {
	position: 'relative',
	width: 186,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 8,

	textAlign: 'center',
	color: '$red',
	fontWeight: 'bold',

	'@bp2': {
		fontSize: '$xl',
		width: 230,
	},

	input: {
		width: '98%',
		borderRadius: '16px',
		border: '2px solid $gray300',
		fontSize: '$xl',
		fontFamily: 'monospace',
		fontVariantNnumeric: 'slashed-zero',
		padding: '8px 14px 8px 50px',
		'&:focus::placeholder': {
			color: 'transparent',
		},

		'&:disabled': {
			backgroundColor: '$gray100',
			color: '$gray600',
			cursor: 'not-allowed',
		},

		'@bp2': {
			fontSize: '$2xl',
		},
	},

	'.icon': {
		position: 'absolute',
		top: 6,
		left: 14,
		zIndex: 2,
		color: '$gray800',

		'@bp2': {
			top: 12,
			left: 14,
		},
	},

	'input:disabled + .icon': {
		color: '$gray600',
	},
})

export const TwoFAContainer = styled('div', {
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: '$gray100',
	border: '4px solid $gray600',
	borderRadius: '0  0 16px 16px',
	cursor: 'pointer',
	transition: '0.2s',

	label: {
		color: '$gray600',
	},

	'&:hover': {
		borderColor: '$green300',
	},

	variants: {
		isTwoFAEnabled: {
			true: {
				backgroundColor: '$green300',
				borderColor: '$green100',
				label: {
					color: '$white',
				},

				'&:hover': {
					borderColor: '$gray100',
				},
			},
		},
	},
})

export const SwitchContainer = styled('div', {
	margin: 32,
	width: 186,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-around',
	label: {
		fontSize: '$xl',
		fontWeight: 'bold',

		'@bp2': {
			fontSize: '$2xl',
		},
	},

	'@bp2': {
		width: 230,
	},
})

export const SwitchButton = styled(Switch.Root, {
	all: 'unset',
	width: 70,
	height: 38,
	backgroundColor: '$gray600',
	borderRadius: 9999,
	position: 'relative',
	boxShadow: '0 2px 10px $gray300',
	'-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',

	'&:focus': {
		boxShadow: '0 0 0 2px $gray600',
	},
	"&[data-state='checked']": {
		backgroundColor: '$green500',
		boxShadow: '0 2px 10px $green100',
	},

	'.thumb': {
		color: '$gray600',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: '$md',
		fontWeight: 'bold',
		width: '34px',
		height: '34px',
		backgroundColor: '$white',
		borderRadius: 9999,
		boxShadow: '0 2px 2px $gray600',
		transition: 'transform 100ms',
		transform: 'translateX(2px)',
		willChange: 'transform',

		"&[data-state='checked']": {
			transform: 'translateX(34px)',
			backgroundColor: '$green300',
			color: '$white',
			fontSize: '$lg',
		},
	},
})
export const SwitchThumb = styled(Switch.Thumb, {})
