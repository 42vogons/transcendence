import { createStitches } from '@stitches/react'

export const {
	config,
	styled,
	css,
	globalCss,
	keyframes,
	getCssText,
	theme,
	createTheme,
} = createStitches({
	theme: {
		colors: {
			white: '#FFF',

			gray900: '#121214',
			gray800: '#202024',
			gray600: '#808080',
			gray300: '#c4c4cc',
			gray100: '#e1e1e6',

			green500: '#00875f',
			green400: '#00a169',
			green300: '#00b37e',
			green100: '#02de2f',

			blue900: '#00111C',
			blue800: '#001523',
			blue700: '#001A2C',
			blue600: '#00253E',
			blue500: '#002945',
			blue400: '#002E4E',
			blue300: '#003356',
			blue200: '#003A61',
			blue100: '#00a7ff',

			orange: '#F15025',

			red: '#DE3C4B',
		},
		fontSizes: {
			md: '1.125rem',
			lg: '1.25rem',
			xl: '1.5rem',
			'2xl': '2rem',
			'3xl': '3rem',
		},

		shadows: {
			white: '#FFF',

			gray900: '#121214',
			gray800: '#202024',
			gray600: '#808080',
			gray300: '#c4c4cc',
			gray100: '#e1e1e6',

			green500: '#00875f',
			green400: '#00a169',
			green300: '#00b37e',
			green100: '#00b37e',

			blue900: '#00111C',
			blue800: '#001523',
			blue700: '#001A2C',
			blue600: '#00253E',
			blue500: '#002945',
			blue400: '#002E4E',
			blue300: '#003356',
			blue200: '#003A61',
			blue100: '#00a7ff',

			red: '#DE3C4B',
		},
	},
	media: {
		bp1: '(min-width: 490px)',
		bp2: '(min-width: 660px)',
		bp3: '(min-width: 1101px)',
		bp4: '(min-width: 1400px)',
	},
})
