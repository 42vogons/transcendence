import { styled } from '..'

export const CourtContainer = styled('div', {
	position: 'relative',
	backgroundColor: '$blue100',
	border: '4px solid rgba( 255, 255, 255, 0.9)',
	// borderRadius: 24,

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
	backgroundColor: '$white',
	borderRadius: 16,
})

export const Ball = styled('div', {
	position: 'absolute',
	content: '',
	backgroundColor: '$white',
	borderRadius: '50%',
	zIndex: 1,
})

export const Score = styled('div', {
	position: 'absolute',
	// display: 'flex',
	// flexDirection: 'row',
	// justifyContent: 'space-around',
	// alignItems: 'center',
	width: '100%',
	fontFamily: 'monospace',
	fontVariantNnumeric: 'slashed-zero',
	color: '$blue100',
	outline: 'none',
	fontWeight: 'bold',
	left: '50%',
	transform: 'translate(-50%, -50%)',

	span: {
		backgroundColor: '$white',
		lineHeight: 1,
		padding: '8px 16px 4px',
		borderRadius: '0 8px 8px 0',
	},

	p: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 16,
		border: '4px solid $white',
		paddingLeft: '1rem',
		outline: 'none',
	},
	variants: {
		playerType: {
			first: {},
			second: {
				p: {
					flexDirection: 'row-reverse',
					paddingLeft: '0',
					paddingRight: '1rem',

					span: {
						borderRadius: '8px 0 0 8px',
					},
				},
			},
		},
		gameSize: {
			l: {
				fontSize: '$xl',
				span: {
					fontSize: '2rem',
				},
				p: {
					gap: 32,
					// borderRadius: 16,
					// paddingLeft: '1rem',
				},
			},
			s: {
				fontSize: 16,
				span: {
					fontSize: 'xl',
					padding: '8px 4px 4px',
				},
				p: {
					gap: 0,
					// borderRadius: 16,
					// paddingLeft: '1rem',
				},
			},
		},
	},
})
