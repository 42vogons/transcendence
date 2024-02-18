import { styled } from '..'

export const UserInputContainer = styled('div', {
	position: 'relative',
	// width: '100%',
	display: 'flex',
	flexDirection: 'column',
	// justifyContent: 'space-around',
	// alignItems: 'center',
	// gap: 16,
	// backgroundColor: '$white',
	// borderRadius: 32,
	// border: '2px solid $gray300',

	label: {
		fontSize: '$3xl',
		color: '$blue100',
		fontWeight: 'bold',
	},

	input: {
		width: '224px',
		borderRadius: 16,
		border: '2px solid $gray300',
		fontSize: '$2xl',
		fontFamily: 'monospace',
		fontVariantNnumeric: 'slashed-zero',
		padding: '8px 14px 8px 50px',
	},

	'.icon': {
		position: 'absolute',
		top: 12,
		left: 14,
	},
})
