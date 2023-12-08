import { styled } from '..'

export const PageContainer = styled('main', {
	margin: '0 auto',
	minHeight: '100vh',
	height: '100%',
	minWidth: '96vw',
	backgroundColor: '$blue800',
	display: 'flex',
	flexDirection: 'column',

	border: '6px solid $white',
	borderRadius: 32,

	'@bp2': {
		minWidth: '80vw',
		maxWidth: '80vw',
	},

	'@bp4': {
		flexDirection: 'row',
	},
})

export const ProfileDataContainer = styled('div', {
	minHeight: '100%',
	flexBasis: '30%',
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

export const ProfileContainer = styled('section', {
	// height: '100%',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
})

export const ProfileImageContainer = styled('div', {
	img: {
		borderRadius: '50%',
		border: '4px solid $white',
	},

	marginBottom: 16,
})

export const TitleContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 32,
	color: '$white',
	padding: '8px 24px',
	h2: {
		textAlign: 'center',
		fontSize: '2.5rem',
	},

	'@bp1': {
		h2: {
			fontSize: '3.5rem',
		},
	},
})

export const MatchHistoryContainer = styled('section', {
	maxHeight: '100vh',
	flexBasis: '70%',
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
		width: 4,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$white',
	},

	'@bp1': {
		padding: '0 2rem',

		'&::-webkit-scrollbar': {
			width: 12,
		},
	},

	'@bp3': {
		marginTop: '3rem',
	},
})
