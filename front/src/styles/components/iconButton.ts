import { styled } from '..'

export const IconButtonContainer = styled('button', {
	position: 'relative',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',

	padding: '12px 12px',
	borderRadius: 14,
	color: '$white',
	backgroundColor: '$blue200',
	border: '2px solid $white',
	cursor: 'pointer',
	transition: '0.2s',

	'.tooltip': {
		display: 'none',
		position: 'absolute',
		left: 80,
		backgroundColor: '$white',
		color: '$blue100',
		fontSize: '$xl',
		fontWeight: 800,
		padding: '4px 16px',
		borderRadius: 14,
		// opacity: '0',
	},

	'&:hover': {
		backgroundColor: '$blue100',
	},

	'&:hover .tooltip': {
		display: 'block',
		opacity: '100%',
	},

	variants: {
		isActive: {
			true: {
				color: '$blue100',
				backgroundColor: '$white',
				border: '2px solid $blue100',
				'&:hover': {
					backgroundColor: '$white',
					opacity: '80%',
				},
			},
		},
	},
})
