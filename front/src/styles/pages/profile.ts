import { styled } from '..'

export const LoadingContainer = styled('main', {
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '$blue800',
})

export const PageContainer = styled('main', {
	minHeight: '100%',
	maxHeight: '100%',
	height: '100%',
	minWidth: '100%',
	maxWidth: '100%',
	backgroundColor: '$blue800',
	display: 'flex',
	flexDirection: 'column',
	borderRadius: '0 32px 32px 0',

	overflowY: 'scroll',

	'&::-webkit-scrollbar': {
		width: 2,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$white',
	},

	'@bp1': {
		'&::-webkit-scrollbar': {
			width: 4,
		},
	},

	'@bp4': {
		flexDirection: 'row',
	},
})

export const ProfileDataContainer = styled('div', {
	flexBasis: '25%',
	padding: '2rem 0.5rem',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 64,

	'@bp1': {
		padding: '2rem 1rem',
	},

	'@bp4': {
		gap: 16,
		borderRight: '6px solid $white',
	},
})

export const ProfileContainer = styled('button', {
	// height: '100%',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	paddingTop: '1rem',
	borderRadius: 16,
	backgroundColor: 'transparent',
	border: '2px solid transparent',
	transition: '0.2s',

	variants: {
		isMyProfile: {
			true: {
				cursor: 'pointer',
				'&:hover': {
					backgroundColor: '$blue500',
					border: '2px solid $white',

					'.icon': {
						display: 'block',
					},
				},
			},
		},
	},
})

export const ProfileImageContainer = styled('div', {
	marginBottom: 16,
	position: 'relative',
	img: {
		borderRadius: '50%',
		border: '4px solid $white',
	},

	'.icon': {
		transition: '0.2s',
		position: 'absolute',
		bottom: 6,
		right: 8,
		display: 'none',
		backgroundColor: '$blue100',
		color: '$white',
		padding: 8,
		borderRadius: 14,
		border: '2px solid $white',
	},
})

export const TitleContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 8,
	color: '$white',
	padding: '8px 24px',
	h2: {
		textAlign: 'center',
		fontSize: '$xl',
		fontFamily: 'monospace',
		fontVariantNnumeric: 'slashed-zero',
	},

	'@bp1': {
		gap: 32,
		h2: {
			fontSize: '$3xl',
		},
	},
})

export const MatchHistoryContainer = styled('section', {
	maxHeight: '100vh',
	minHeight: '100%',
	flexBasis: '75%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	borderRadius: '0 28px 28px 0',
	padding: '0.5rem 0',

	'@bp1': {
		padding: '2rem 0',
	},
})

export const MatchCardsContainer = styled('div', {
	marginTop: '0',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: 24,
	padding: '0 0.5rem',
	overflowY: 'scroll',

	'&::-webkit-scrollbar': {
		width: 2,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$white',
	},

	'@bp1': {
		// padding: '0 1rem',
		padding: '0 1rem',
		// paddingRight: '1rem',

		'&::-webkit-scrollbar': {
			width: 4,
		},
	},

	// '@bp2': {
	// },

	'@bp3': {
		marginTop: '3rem',
		padding: '0 2rem',
	},
})

export const MessageContainer = styled('main', {
	width: '100%',
	height: '100%',
	backgroundColor: '$blue800',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
})
