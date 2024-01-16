import { styled } from '..'

export const CourtContainer = styled('div', {
	position: 'relative',
	width: 928,
	height: 458,
	backgroundColor: '$blue100',
	border: '4px solid rgba( 255, 255, 255, 0.9)',
	boxShadow: '-6px -6px 12px #0093e0, 6px 6px 12px #00bbff',
	borderRadius: 24,

	'&:after': {
		position: 'absolute',
		content: '',
		width: 'calc(50% - 5px)',
		height: '100%',
		borderRight: '10px dashed $white',
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
				// backgroundColor: '$green100',
			},
			right: {
				right: 10,
				// backgroundColor: '$red',
			},
		},
	},
})
