import { keyframes } from '@stitches/react'
import { styled } from '..'

export const HomeContainer = styled('main', {
	position: 'relative',
	minHeight: '100%',
	maxHeight: '100%',
	height: '100%',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	fontSize: '$2xl',
	borderRadius: 32,

	a: {
		marginTop: '1rem',
		textDecoration: 'none',
		background: '$green500',
		color: '$white',

		padding: '0.5rem 1rem',
		borderRadius: '16px',
		fontWeight: 800,
		transition: '0.2s',

		'&:hover': {
			color: '$green500',
			background: '$white',
		},
	},
	// background: 'rgba(0,167,255,0.15)',
	backgroundColor: '$blue800',
})

export const Header = styled('header', {
	width: '100%',
	height: 78,
	backgroundColor: '$blue300',
	borderTopRightRadius: 30,
	borderBottom: '1px solid $blue100',
	display: 'flex',
	justifyContent: 'end',
	alignItems: 'center',

	button: {
		backgroundColor: 'transparent',
		display: 'flex',
		alignItems: 'center',
		color: '$white',
		cursor: 'pointer',
		padding: '4px 8px',
		borderRadius: 16,
		border: '4px solid transparent',
		transition: '0.2s',

		p: {
			marginLeft: '1rem',
			fontSize: '$2xl',
			fontFamily: 'monospace',
			fontVariantNnumeric: 'slashed-zero',
		},
	},

	'button:hover': {
		backgroundColor: '$blue100',
		border: '4px solid rgba(255, 255, 255, 0.4)',
	},

	'@bp1': {
		padding: '0 1rem',
	},

	'@bp3': {
		borderTopRightRadius: 26,
	},
})

export const GameContainer = styled('div', {
	height: '100%',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
})

const pulse = keyframes({
	'0%': {
		boxShadow: '-2px -2px 6px #0093e0,2px 2px 6px #00bbff',
	},
	'70%': {
		boxShadow: '-2px -2px 6px 4px #0093e0,2px 2px 6px 4px #00bbff',
	},
})

export const PlayButton = styled('button', {
	minWidth: 180,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: 32,
	fontSize: '$2xl',
	fontWeight: 'bold',
	padding: '0.5rem 1rem',
	borderRadius: 32,
	color: '$white',
	cursor: 'pointer',
	transition: '0.3s',
	animation: `${pulse} 1600ms infinite`,
	border: '4px solid rgba( 255, 255, 255, 0.4 )',

	background: '#00a7ff',

	'&:hover': {
		background: '$white',
		color: '#00a7ff',
		animation: 'none',
		border: '4px solid rgba( 0, 167, 255, 0.8 )',
		transform: 'scaleY(1.1) scaleX(1.05)',
	},

	variants: {
		type: {
			modal: {
				width: '97%',
				'@bp2': {
					width: 230,
					fontSize: '$xl',
					marginRight: 8,
				},

				'@bp3': {
					fontSize: '$2xl',
				},
			},
		},
	},
})

export const LoadingContainer = styled('div', {
	backgroundColor: '$white',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	color: '$blue100',
	padding: '1rem 2rem',
	borderRadius: 16,

	button: {
		margin: '2rem 0 1rem',
	},
})

export const PauseModal = styled('div', {
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
	justifyContent: 'center',
	alignItems: 'center',
	gap: 32,
	h2: {
		fontSize: '$2xl',
		color: '$red',
		textAlign: 'center',

		'@bp2': {
			fontSize: 80,
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
