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
	maxHeight: '86vh',
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
	backgroundColor: '$blue300',
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

export const ChatInputContainer = styled('div', {
	maxHeight: '200px',
	display: 'flex',
	flexDirection: 'row',
	padding: '1rem 1rem',
	overflowY: 'scroll',
	backgroundColor: '$blue700',
	borderRadius: '0 0 32px 32px',
	fontSize: '$xl',
	lineHeight: 1.25,

	'@bp1': {
		padding: '1rem 2rem 2rem',
	},
})
