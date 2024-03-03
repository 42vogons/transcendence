import { styled } from '..'

export const ModalContainer = styled('div', {
	position: 'fixed',
	top: 0,
	left: 0,
	zIndex: 1000,
	height: '100vh',
	width: '100vw',
	backgroundColor: 'rgba(0,0,0, 0.7)',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
})

export const ModalContent = styled('div', {
	backgroundColor: '$white',
	padding: '1rem',
	borderRadius: 16,
	height: 800,
	width: 600,
	maxHeight: '80vh',
	maxWidth: '86vw',
	color: '$gray900',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',

	'@bp2': {
		padding: '4rem 1rem',
	},
})
