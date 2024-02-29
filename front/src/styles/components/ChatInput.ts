import { styled } from '..'

export const ChatInputContainer = styled('form', {
	borderTop: '1px solid $white',
	height: 'calc(100% - 60px - 80%)',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0 .5rem',
	backgroundColor: '$blue700',
	borderRadius: '0 0 32px 0',

	input: {
		width: '100%',
		padding: '0.25rem 0.5rem',
		fontSize: '$2xl',
		lineHeight: 1.25,
		backgroundColor: '$blue300',
		color: '$white',
		borderRadius: '16px',
		border: 'none',

		'&:focus-visible': {
			outline: '2px solid $white',
		},
	},

	button: {
		marginLeft: '0.25rem',
		padding: '0.75rem',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		border: 'none',
		borderRadius: '50%',
		cursor: 'pointer',
		backgroundColor: 'transparent',
		color: '$green300',
		transition: '0.2s',

		'&:disabled': {
			opacity: '40%',
			cursor: 'not-allowed',
		},

		'&:not(:disabled):hover': {
			backgroundColor: '$green300',
			color: '$white',
		},
	},

	'@bp1': {
		padding: '1rem 1rem',
		height: 96,

		input: {
			padding: '1rem',
		},

		button: {
			marginLeft: '0.75rem',
		},
	},
})
