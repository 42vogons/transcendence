import { styled } from '..'

export const PageContainer = styled('main', {
	margin: '0 auto',
	height: '100vh',
	width: '80vw',
	backgroundColor: '$blue900',
	display: 'flex',
	flexDirection: 'row',
	gap: 16,
})

export const ProfileDataContainer = styled('div', {
	flexBasis: '20%',
	backgroundColor: '$green500',
	padding: '2rem 1rem',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 32,
})

export const ProfileContainer = styled('div', {
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

export const UserContainer = styled('div', {
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 32,
	color: '$white',
	h2: {
		textAlign: 'center',
		fontSize: '3.5rem',
	},
})

export const StatsContainer = styled('div', {
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '$blue100',
})

export const MatchHistoryContainer = styled('div', {
	flexBasis: '78%',
	backgroundColor: '$red',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
})
