import { styled } from '..'

export const CourtContainer = styled('div', {
	position: 'relative',
	backgroundColor: '$blue100',
	border: '4px solid rgba( 255, 255, 255, 0.9)',
	borderRadius: 24,

	'&:before': {
		position: 'absolute',
		content: '',
		width: 'calc(50% - 5px)',
		height: '100%',
		borderRight: '10px dashed $white',
		zIndex: 0,
	},
})

export const Paddle = styled('div', {
	position: 'absolute',
	content: '',
	width: 10,
	height: 100,
	backgroundColor: '$white',
	borderRadius: 16,

	variants: {
		type: {
			left: {
				left: 10,
			},
			right: {
				right: 10,
			},
		},
	},
})

export const Ball = styled('div', {
	position: 'absolute',
	content: '',
	width: 30,
	height: 30,
	backgroundColor: '$white',
	borderRadius: '50%',
	zIndex: 1,
})

export const Score = styled('div', {
	position: 'absolute',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-around',
	alignItems: 'center',
	top: -100,
	width: '100%',
	fontSize: '$3xl',
	fontFamily: 'monospace',
	fontVariantNnumeric: 'slashed-zero',
	color: '$blue100',
	outline: 'none',
	fontWeight: 'bold',

	span: {
		backgroundColor: '$white',
		fontSize: '4rem',
		lineHeight: 1,
		padding: '8px 16px 4px',
		borderRadius: '0 8px 8px 0',
	},

	p: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 32,
		borderRadius: 16,
		border: '4px solid $white',
		paddingLeft: '1rem',
		outline: 'none',
	},

	'p~p': {
		flexDirection: 'row-reverse',
		paddingLeft: '0',
		paddingRight: '1rem',

		span: {
			borderRadius: '8px 0 0 8px',
		},
	},
})
