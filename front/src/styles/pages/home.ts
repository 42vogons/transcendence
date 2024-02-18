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
	justifyContent: 'center',
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
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: 78,
	padding: '0 1rem',
	backgroundColor: '$blue300',
	borderTopRightRadius: 30,
	borderBottom: '1px solid $blue100',
	display: 'flex',
	justifyContent: 'end',
	alignItems: 'center',

	button: {
		backgroundColor: 'transparent',
		border: 'none',
		display: 'flex',
		color: '$white',
		// cursor: 'pointer',
		height: '100%',
		alignItems: 'center',

		p: {
			marginLeft: '1rem',
			fontSize: '$2xl',
			fontFamily: 'monospace',
			fontVariantNnumeric: 'slashed-zero',
		},
	},

	'@bp3': {
		borderTopRightRadius: 26,
	},
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
	height: '100%',
	width: '100%',
	// backgroundColor: 'red',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 64,
	h2: {
		fontSize: 80,
		color: '$red',
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
