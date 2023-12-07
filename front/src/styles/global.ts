import { globalCss } from '.'

export const globalStyles = globalCss({
	'*': {
		margin: 0,
		padding: 0,
		boxSizing: 'border-box',
	},

	body: {
		minHeight: '100vh',
		background: 'url(assets/background.png)',
		color: '$gray100',
	},

	'body, input, textarea, button': {
		fontFamily: 'Roboto',
		fontWeight: 400,
	},
})
