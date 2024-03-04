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

export const Card = styled('button', {
	minHeight: 250,
	maxHeight: 250,
	// width: '100%',
	margin: '0.5rem',
	flex: '0 0 100%',
	// maxHeight: '92%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-between',
	borderRadius: '12px 12px 32px 32px',
	padding: '0.5rem',

	variants: {
		isWinner: {
			true: {
				border: '4px solid $white',
				backgroundColor: '$green400',

				'&:hover .user': {
					transition: '0.2s',
					border: '1px solid $white',
					backgroundColor: '$white',
					color: '$green400',
				},
			},
			false: {
				border: 'none',
				backgroundColor: '$red',

				'&:hover .user': {
					transition: '0.2s',
					border: '1px solid $white',
					backgroundColor: '$white',
					color: '$red',
				},
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

	'&:hover': {
		cursor: 'pointer',
	},
})

export const UserContainer = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: 12,

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
	borderRadius: 24,
	border: '1px solid transparent',
	fontFamily: 'monospace',
	fontVariantNnumeric: 'slashed-zero',
	h2: {
		textAlign: 'center',
		fontSize: '$md',
	},

	'@bp1': {
		h2: {
			fontSize: '$xl',
		},
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
