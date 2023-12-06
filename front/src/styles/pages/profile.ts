import { styled } from '..'

export const PageContainer = styled('main', {
	margin: '0 auto',
	minHeight: '100vh',
	height: '100%',
	minWidth: '96vw',
	backgroundColor: '$blue600',
	display: 'flex',
	flexDirection: 'column',
	// gap: 16,

	border: '6px solid $white',
	borderRadius: 32,

	'@bp2': {
		minWidth: '80vw',
		maxWidth: '80vw',
	},

	'@bp3': {
		flexDirection: 'row',
	},
})

export const ProfileDataContainer = styled('div', {
	minHeight: '100%',
	flexBasis: '25%',
	padding: '2rem 0.5rem',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 16,
	borderRight: '6px solid $white',

	'@bp1': {
		padding: '2rem 1rem',
	},
})

export const ProfileContainer = styled('section', {
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
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 32,
	color: '$white',
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
	flexBasis: '75%',
	// backgroundColor: '$red',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	borderRadius: '0 28px 28px 0',
})
