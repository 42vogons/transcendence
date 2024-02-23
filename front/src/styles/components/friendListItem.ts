import { styled } from '..'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export const FriendListItemWrapper = styled(DropdownMenu.Root, {})

export const FriendListItemContainer = styled(DropdownMenu.Trigger, {
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	color: '$white',
	backgroundColor: '$blue600',
	border: 'none',
	borderBottom: '1px solid $white',
	padding: '0.5rem 1rem 0.5rem 0.5rem',
	outline: 'none',
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: '$blue200',
	},
})

export const FriendAvatarContainer = styled('div', {
	position: 'relative',
	borderRadius: '50%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',

	img: {
		borderRadius: '50%',
		border: '2px $blue600 solid',
	},

	'.statusIndicator': {
		position: 'absolute',
		width: 15,
		height: 15,
		borderRadius: '50%',
		border: '2px solid $blue600',
		bottom: 0,
		right: 0,
	},

	variants: {
		status: {
			online: {
				'.statusIndicator': {
					backgroundColor: '$green100',
				},
			},
			ingame: {
				'.statusIndicator': {
					backgroundColor: '$red',
				},
			},
			offline: {
				'.statusIndicator': {
					backgroundColor: 'transparent',
				},
			},
		},
	},
})

export const FriendInfoContainer = styled('div', {
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
})

export const FriendName = styled('h2', {
	fontSize: '$md',
	fontFamily: 'monospace',
	fontVariantNnumeric: 'slashed-zero',

	variants: {
		status: {
			online: {
				color: '$white',
			},
			ingame: {
				color: '$white',
			},
			offline: {
				color: '$gray600',
			},
		},
	},
})

export const MenuContent = styled(DropdownMenu.Content, {
	marginLeft: 94,
})

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

export const FriendAction = styled('button', {
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
