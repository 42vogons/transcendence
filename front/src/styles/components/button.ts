import { styled } from '..'

export const ButtonContainer = styled('button', {
	width: '100%',
	display: 'flex',
	justifyContent: 'space-around',
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

	'&:disabled': {
		opacity: '40%',
		cursor: 'not-allowed',
	},

	'@bp2': {
		width: 230,
		justifyContent: 'space-between',
	},

	variants: {
		buttonType: {
			cancel: {
				backgroundColor: '$red',
				'&:not(:disabled):hover': {
					backgroundColor: '$white',
					color: '$red',
					border: '4px solid $red',
				},
			},

			accept: {
				backgroundColor: '$green300',
				'&:not(:disabled):hover': {
					backgroundColor: '$white',
					color: '$green300',
					border: '4px solid $green300',
				},
			},

			default: {
				backgroundColor: '$blue100',
				'&:not(:disabled):hover': {
					backgroundColor: '$white',
					color: '$blue100',
					border: '4px solid $blue100',
				},
			},
		},
	},
})
