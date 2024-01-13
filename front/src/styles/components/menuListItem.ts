import { styled } from '..'

export const MenuListItemContainer = styled('button', {
	margin: '1.5rem 1rem 0',
	width: '224px',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	color: '$white',
	backgroundColor: '$blue200',
	border: '4px solid transparent',
	cursor: 'pointer',
	padding: '4px 16px',
	borderRadius: 14,

	'.title': {
		width: '100%',
		color: '$white',
		fontSize: '$xl',
		fontWeight: 800,
		borderRadius: 14,
		textAlign: 'center',
	},

	'&:hover': {
		backgroundColor: '$blue100',
		'.title': {
			color: '$white',
		},
	},

	'&:last-of-type': {
		marginBottom: '1.5rem',
	},

	variants: {
		isActive: {
			true: {
				color: '$blue100',
				backgroundColor: '$white',
				border: '4px solid $blue100',
				'.title': {
					color: '$blue100',
				},
				'&:hover': {
					color: '$white',
					opacity: '80%',
				},
			},
		},
	},
})
