import { styled } from '..'

export const HomeContainer = styled('main', {
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: 656,
	fontSize: '$2xl',

	a: {
		marginTop: '1rem',
		textDecoration: 'none',
		background: '$green500',
		color: '$white',

		padding: '0.5rem 1rem',
		borderRadius: '16px',
		fontWeight: 800,
		transition: '0.2s',

		'&:hover': {
			color: '$green500',
			background: '$white',
		},
	},
})
