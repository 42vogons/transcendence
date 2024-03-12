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

	'&:hover': {
		backgroundColor: '$blue100',
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
			default: {
				display: 'flex',
				padding: '12px',
				borderRadius: 14,
				border: '2px solid transparent',
			},
		},
	},

	'@bp3': {
		border: '2px solid $white',
	},
})
