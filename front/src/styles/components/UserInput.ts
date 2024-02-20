import { styled } from '..'

export const UserInputContainer = styled('div', {
	position: 'relative',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	borderRadius: 16,
	border: '1px solid $gray300',

	label: {
		fontSize: '$3xl',
		color: '$blue100',
		fontWeight: 'bold',
	},

	input: {
		width: '100%',
		borderRadius: '16px',
		border: 'none',
		fontSize: '$2xl',
		fontFamily: 'monospace',
		fontVariantNnumeric: 'slashed-zero',
		padding: '8px 14px 8px 50px',
	},

	variants: {
		hasOption: {
			true: {
				input: {
					borderRadius: '16px 16px  0 0 ',
					borderBottom: '2px solid $gray300',
				},
			},
		},
	},

	'.icon': {
		position: 'absolute',
		top: 12,
		left: 14,
	},
})

export const UserList = styled('ul', {
	maxHeight: 80,
	overflowY: 'auto',

	'&::-webkit-scrollbar': {
		width: 4,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$blue100',
	},
})
export const UserListItem = styled('li', {
	display: 'flex',
	alignItems: 'center',
	gap: 4,
	borderBottom: '1px solid $gray300',
	padding: '8px 14px 8px 14px',

	cursor: 'pointer',
	transition: 'all 0.2s',

	'&:hover': {
		background: '$blue200',
		color: '$white',
	},

	'&:last-of-type': {
		borderBottom: 'none',
		borderRadius: '0 0 0 16px',
	},
})

export const UserAvatarContainer = styled('div', {
	position: 'relative',
	borderRadius: '50%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	background: 'transparent',

	img: {
		borderRadius: '50%',
		border: '1px solid transparent',
	},
})

export const Username = styled('p', {
	fontSize: '$2xl',
	fontFamily: 'monospace',
	fontVariantNnumeric: 'slashed-zero',
})
