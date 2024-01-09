import { styled } from '..'

export const ChatContainer = styled('main', {
	margin: '0 auto',
	minHeight: '100%',
	maxHeight: '100%',
	height: '100%',
	width: '100%',
	backgroundColor: '$blue800',
	display: 'flex',
	flexDirection: 'column',

	borderRadius: 32,
})

export const ChatHeader = styled('header', {
	height: 60,
	width: '100%',
	backgroundColor: '$blue500',
	borderRadius: '32px 32px 0 0',
	padding: '1rem 2rem',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
})

export const ChatHeaderTextContainer = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	marginLeft: '1rem',
	gap: 4,
})

export const ChatTitle = styled('h2', {
	fontSize: '$lg',
	fontFamily: 'monospace',
	fontVariantNnumeric: 'slashed-zero',
})

export const ChatSubTitle = styled('p', {})

export const ChatMessageContainer = styled('div', {
	minHeight: '75%',
	maxHeight: '78vh',
	display: 'flex',
	flexDirection: 'column',
	padding: '1rem 1rem',
	overflowY: 'scroll',

	'&::-webkit-scrollbar': {
		width: 2,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$white',
	},

	'@bp1': {
		padding: '1rem 2rem 2rem',
		minHeight: '33%',

		'&::-webkit-scrollbar': {
			width: 4,
		},
	},
	'@bp3': {
		minHeight: '77%',
	},
})

export const ChatMessage = styled('div', {
	marginTop: '1.5rem',
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: '$blue600',
	gap: 8,
	maxWidth: '80%',
	fontSize: '$lg',
	lineHeight: 1.25,
	padding: '0.5rem 1rem',
	borderRadius: 24,
	color: '$white',

	variants: {
		isLoggedUser: {
			true: {
				backgroundColor: '$green500',
				alignSelf: 'end',
			},
		},
	},

	'@bp1': {
		maxWidth: '60%',
	},
})

export const ChatInputContainer = styled('form', {
	borderTop: '1px solid $white',
	height: 'calc(100% - 60px - 80%)',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0 .5rem',
	backgroundColor: '$blue700',
	borderRadius: '0 0 32px 32px',

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

		'&:hover': {
			backgroundColor: '$green300',
			color: '$white',
		},
	},

	'@bp1': {
		padding: '1rem 1rem',
		height: 100,

		input: {
			padding: '1rem',
		},

		button: {
			marginLeft: '0.75rem',
		},
	},
})
