import { styled } from '..'

export const IconButtonContainer = styled('button', {
	position: 'relative',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	color: '$white',
	backgroundColor: '$blue200',
	border: '2px solid transparent',
	cursor: 'pointer',
	transition: '0.2s',

	'.tooltip': {
		display: 'none',
		position: 'absolute',
		left: 40,
		backgroundColor: '$white',
		color: '$blue100',
		fontSize: '$xl',
		fontWeight: 800,
		padding: '4px 16px',
		borderRadius: 14,
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
		type: {
			mobile: {
				display: 'flex',
				padding: '6px 1px',
				borderRadius: 4,
				'@bp3': {
					display: 'none',
				},
			},
			desktop: {
				display: 'none',
				'@bp2': {
					// display: 'flex',
					padding: '6px 1px',
					borderRadius: 8,
				},
				'@bp3': {
					display: 'flex',
					padding: '12px',
					borderRadius: 14,
				},
			},
		},
	},

	'@bp3': {
		border: '2px solid $white',

		'.tooltip': {
			left: 80,
		},
	},
})
