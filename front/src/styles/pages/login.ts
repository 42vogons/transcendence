import { styled } from '..'

export const Wrapper = styled('div', {
	width: '100vw',
	height: '100vh',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
})

export const LoginContainer = styled('main', {
	position: 'relative',
	// margin: '10rem auto auto',
	display: 'flex',
	flexDirection: 'column',
	width: '90%',
	justifyContent: 'space-between',
	alignItems: 'center',
	minHeight: '90%',
	fontSize: '$2xl',
	backgroundColor: '$blue700',
	borderRadius: '32px',
	border: '4px solid $white',

	'@bp2': {
		width: 600,
		minHeight: 400,
	},

	'@bp3': {
		width: 600,
		minHeight: 656,
	},
})

export const Title = styled('div', {
	position: 'absolute',
	width: '100%',
	minHeight: '30%',
	maxHeight: 326,
	backgroundColor: '$white',
	textShadow:
		'-1px 0 $blue100, 0 1px $blue100, 1px 0 $blue100, 0 -1px $blue100',
	fontFamily: 'Lexend Deca',
	fontSize: '4rem',
	borderRadius: '20px 20px 0 0',
	img: {
		margin: 'auto',
		maxWidth: 178,
		maxHeight: 150,
	},

	'@bp2': {
		minHeight: '60%',
		img: {
			margin: 'auto',
			maxWidth: 384,
			maxHeight: 259,
		},
	},
})

export const ConnectButtonContainer = styled('div', {
	margin: 'auto auto',
	display: 'flex',
	flexDirection: 'column',
	gap: 16,
	a: {
		textDecoration: 'none',
	},

	'@bp2': {
		margin: '18rem auto auto',
	},

	'@bp3': {
		margin: '30rem auto auto',
	},
})

export const ConnectButton = styled('button', {
	minWidth: '80%',
	display: 'flex',
	justifyContent: 'space-around',
	alignItems: 'center',
	fontSize: '$xl',
	fontWeight: 400,
	padding: '0.5rem',
	gap: 16,
	border: 'none',
	backgroundColor: '$white',
	color: '$blue200',
	borderRadius: 16,
	cursor: 'pointer',
	transition: '0.2s',

	'&:hover': {
		backgroundColor: '$gray300',
	},

	'@bp1': {
		minWidth: 400,
		padding: '0.5rem 1rem',
		fontSize: '$2xl',
	},
})
