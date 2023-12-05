import { styled } from '..'

export const LoginContainer = styled('main', {
	position: 'relative',
	margin: '10rem auto auto',
	display: 'flex',
	flexDirection: 'column',
	width: '90%',
	justifyContent: 'space-between',
	alignItems: 'center',
	minHeight: 400,
	fontSize: '$2xl',
	backgroundColor: 'transparent',
	borderRadius: '32px',
	border: '4px solid $white',

	'@bp2': {
		width: 600,
		minHeight: 656,
	},
})

export const Title = styled('div', {
	position: 'absolute',
	width: '100%',
	minHeight: '40%',
	maxHeight: 326,
	backgroundColor: '$white',
	textShadow:
		'-1px 0 $blue100, 0 1px $blue100, 1px 0 $blue100, 0 -1px $blue100',
	fontFamily: 'Lexend Deca',
	fontSize: '4rem',
	borderRadius: '20px 20px 0 0',
	img: {
		margin: 'auto',
		maxWidth: 223,
		maxHeight: 150,
	},

	'@bp2': {
		img: {
			margin: 'auto',
			maxWidth: 384,
			maxHeight: 259,
		},
	},
})

export const ConnectButtonContainer = styled('div', {
	margin: '12rem auto auto',
	display: 'flex',
	flexDirection: 'column',
	gap: 16,

	'@bp2': {
		margin: '20rem auto auto',
	},
})

export const ConnectButton = styled('button', {
	minWidth: '80%',
	display: 'flex',
	justifyContent: 'space-around',
	alignItems: 'center',
	fontSize: '$xl',
	fontWeight: 400,
	padding: '0.5rem 1rem',
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
		fontSize: '$2xl',
	},
})
