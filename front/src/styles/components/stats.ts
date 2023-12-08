import { styled } from '..'

export const StatsContainer = styled('section', {
	width: '100%',
	// height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 16,
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

export const StatsPanelContainer = styled('div', {
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	gap: 16,

	'@bp4': {
		flexDirection: 'column',
		flexWrap: 'nowrap',
	},
})

export const StatsPanel = styled('div', {
	flex: '1 0 31%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	border: '4px solid $white',
	borderRadius: 16,
	gap: 16,
	padding: '0.5rem 1rem',

	div: {
		color: '$white',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 16,
		h2: {
			fontSize: '$2xl',
		},

		'@bp1': {
			h2: {
				fontSize: '$3xl',
			},
		},
	},

	p: {
		fontWeight: 700,
		fontSize: '$xl',
	},

	'@bp1': {
		p: {
			fontSize: '$2xl',
		},
	},
})
