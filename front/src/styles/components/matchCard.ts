import { styled } from '..'

export const MatchCardContainer = styled('div', {
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-between',
	borderBottom: '6px solid $white',
	paddingBottom: '1rem',

	span: {
		fontSize: '$1xl',
		color: '$white',
	},

	'@bp1': {
		span: {
			fontSize: '$2xl',
		},
	},

	'@bp2': {
		flexDirection: 'row',
	},
})

export const Card = styled('div', {
	minHeight: 240,
	maxHeight: 240,
	// width: '100%',
	margin: '0.5rem',
	flex: '0 0 100%',
	// maxHeight: '92%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-between',
	borderRadius: '12px 12px 32px 32px',
	padding: '0.5rem 0',

	variants: {
		isWinner: {
			true: {
				border: '4px solid $white',
				backgroundColor: '$green500',
			},
			false: {
				border: 'none',
				backgroundColor: '$red',
			},
		},
	},

	'&:nth-child(3)': {
		flexDirection: 'column-reverse',
		borderRadius: '32px 32px 12px 12px',
	},

	'@bp1': {
		margin: '1rem',
		flexDirection: 'row',
		padding: '0.5rem',
		'&:nth-child(3)': {
			flexDirection: 'row-reverse',
		},
		flex: '0 0 45%',
	},

	'@bp3': {
		margin: '0 0.5rem 0.5rem',
		borderRadius: '12px 32px 32px 12px',

		'&:nth-child(3)': {
			borderRadius: '32px 12px 12px 32px',
		},
	},
})

export const UserContainer = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'center',

	'@bp1': {
		flexDirection: 'column',
	},
})

export const UserImageContainer = styled('div', {
	img: {
		borderRadius: '50%',
		border: '2px solid $white',
	},
})

export const UsernameContainer = styled('div', {
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 8,
	color: '$white',

	padding: '8px 12px',
	borderBottom: '2px solid $white',
	borderRadius: 24,
	h2: {
		textAlign: 'center',
		fontSize: '$xl',
	},
})

export const Score = styled('h3', {
	fontSize: '4rem',
	color: '$white',
	lineHeight: 1,

	'@bp1': {
		fontSize: '6rem',
	},
})
