import { styled } from '..'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

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
	padding: '0.5rem',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',

	img: {
		borderRadius: '50%',
		border: '1px $blue600 solid',
	},

	'@bp1': {
		padding: '1rem 2rem',
	},
})

export const ChatHeaderTextContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: 16,
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

export const ChatMenuWrapper = styled(DropdownMenu.Root, {})

export const ChatMenu = styled(DropdownMenu.Trigger, {
	outline: 'none',
	padding: '0.5rem',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	border: 'none',
	borderRadius: 14,
	cursor: 'pointer',
	backgroundColor: 'transparent',
	color: '$white',
	transition: '0.2s',

	'&:hover': {
		backgroundColor: '$blue100',
	},
})

export const MenuContent = styled(DropdownMenu.Content, {})

export const MenuArrow = styled(DropdownMenu.Arrow, {
	fill: 'white',
})

export const MenuItem = styled(DropdownMenu.Item, {
	outline: 'none',

	'&:first-of-type button': {
		borderRadius: '8px 8px 0 0',
	},

	'&:last-of-type button': {
		borderBottom: 'none',
		borderRadius: '0 0 8px 8px',
	},
})

export const MenuAction = styled('button', {
	width: 140,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '0.5rem 1rem',
	backgroundColor: '$white',
	color: '$blue100',
	fontSize: 18,
	fontWeight: 'bold',
	border: 'none',
	outline: 'none',
	borderBottom: '1px solid $blue100',
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: '$blue100',
		color: '$white',
	},
})

export const ChatMessage = styled('div', {
	position: 'relative',
	marginTop: '1.5rem',
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: '$blue600',
	gap: 4,
	width: 'fit-content',
	maxWidth: '80%',
	fontSize: '$lg',
	lineHeight: 1.25,
	padding: '0.5rem 0.5rem',
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
		padding: '0.5rem 1rem',
	},
})

export const ChatMessageTimestamp = styled('div', {
	width: 120,
	position: 'absolute',
	bottom: -16,
	right: 16,
	textAlign: 'end',
	fontSize: 10,
	fontWeight: '300',
})
export const SenderMenuWrapper = styled(DropdownMenu.Root, {})

export const SenderMenu = styled(DropdownMenu.Trigger, {
	outline: 'none',
	width: 140,
	padding: '0.25rem 0.5rem',
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	border: 'none',
	borderRadius: 14,
	cursor: 'pointer',
	backgroundColor: 'transparent',
	color: '$white',
	transition: '0.2s',
	fontSize: '$lg',
	fontWeight: 'bold',
	fontFamily: 'monospace',
	fontVariantNnumeric: 'slashed-zero',

	'&:hover': {
		backgroundColor: '$blue100',
	},
})
