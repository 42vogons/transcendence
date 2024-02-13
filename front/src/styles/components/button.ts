import { styled } from '..'

export const ButtonContainer = styled('button', {
	width: 230,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: 32,
	color: '$white',
	fontSize: '$2xl',
	fontWeight: 'bold',
	padding: '0.5rem 1rem',
	borderRadius: 32,
	border: '4px solid transparent',
	cursor: 'pointer',
	transition: '0.2s',

	variants: {
		buttonType: {
			cancel: {
				backgroundColor: '$red',
				'&:hover': {
					backgroundColor: '$white',
					color: '$red',
					border: '4px solid $red',
				},
			},

			accept: {
				backgroundColor: '$green300',
				'&:hover': {
					backgroundColor: '$white',
					color: '$green300',
					border: '4px solid $green300',
				},
			},

			default: {
				backgroundColor: '$blue100',
				'&:hover': {
					backgroundColor: '$white',
					color: '$blue100',
					border: '4px solid $blue100',
				},
			},
		},
	},
})
