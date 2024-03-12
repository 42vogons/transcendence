import { styled } from '..'

export const ChatListItemContainer = styled('button', {
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: 8,
	color: '$white',
	backgroundColor: '$blue600',
	border: 'none',
	borderBottom: '1px solid $white',
	padding: '0.5rem 1rem 0.5rem 0.5rem',
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: '$blue300',
	},

	variants: {
		isActive: {
			true: {
				backgroundColor: '$blue200',
			},
		},
	},
})

export const ChatAvatarContainer = styled('div', {
	position: 'relative',
	borderRadius: '50%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',

	img: {
		backgroundColor: '$blue800',
		borderRadius: '50%',
		border: '2px $blue600 solid',
	},
})

export const ChatInfoContainer = styled('div', {
	height: '100%',
	minWidth: 0,
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'start',
	gap: 8,
})

export const ChatName = styled('h2', {
	width: '100%',
	fontSize: '$md',
	textAlign: 'start',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',

	variants: {
		type: {
			direct: {
				fontFamily: 'monospace',
				fontVariantNnumeric: 'slashed-zero',
			},
			public: {},
			protected: {},
			private: {},
		},
	},
})

export const ChatLastMessage = styled('p', {
	width: '100%',
	color: '$gray100',
	fontSize: '1rem',
	textAlign: 'start',
	opacity: '70%',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',

	variants: {
		isActive: {
			true: {
				color: '$white',
				opacity: '100%',
			},
		},
	},
})
