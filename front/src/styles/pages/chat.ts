import { styled } from '..'

export const ChatContainer = styled('main', {
	margin: '0 auto',
	minHeight: '100vh',
	mmaxHeight: '100vh',
	height: '100%',
	width: '96vw',
	backgroundColor: '$blue800',
	display: 'flex',
	flexDirection: 'column',

	border: '6px solid $white',
	borderRadius: 32,

	'@bp2': {
		minWidth: '80vw',
		maxWidth: '80vw',
	},
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
})

export const ChatSubTitle = styled('p', {})

export const ChatMessageContainer = styled('div', {
	maxHeight: '78vh',
	display: 'flex',
	flexDirection: 'column',
	padding: '1rem 1rem',
	overflowY: 'scroll',

	'&::-webkit-scrollbar': {
		width: 4,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$white',
	},

	'@bp1': {
		padding: '1rem 2rem 2rem',

		'&::-webkit-scrollbar': {
			width: 12,
		},
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
	minHeight: 'calc(100vh - 60px - 80vh)',
	height: '100%',
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

		input: {
			padding: '1rem',
		},

		button: {
			marginLeft: '0.75rem',
		},
	},
})
