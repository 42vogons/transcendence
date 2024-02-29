import { styled } from '..'

export const LayoutContainer = styled('div', {
	width: '100vw',
	height: '100vh',
	padding: '0 2%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',

	'@bp3': {
		padding: '0 5%',
	},
})

export const ApplicationContainer = styled('div', {
	// marginTop: '1%',
	width: '100%',
	position: 'relative',
	height: '98%',
	border: '2px solid $white',
	borderRadius: 32,
	display: 'flex',
	flexDirection: 'row',

	'@bp1': {
		height: '90%',
	},

	'@bp3': {
		border: '6px solid $white',
	},
})

export const SidebarContainer = styled('div', {
	position: 'absolute',
	top: 0,
	width: 32,
	height: '100%',
	maxHeight: '100%',
	minHeight: '100%',
	padding: '2rem 0 2rem',
	backgroundColor: '$blue600',
	borderRadius: '32px 0 0 32px',
	borderRight: '1px solid $blue100',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 12,
	zIndex: 1,

	'@bp1': {
		width: 40,
	},

	'@bp2': {
		width: 45,
	},

	'@bp3': {
		borderRadius: '26px 0 0 26px',
		width: 80,
	},
})

export const SidePanelContainer = styled('div', {
	// marginLeft: 80,
	position: 'absolute',
	width: '90%',
	height: '100%',

	alignItems: 'center',

	backgroundColor: '$blue700',
	// backgroundColor: '$red',
	borderRadius: '30px 0 0 30px',
	borderRight: '4px solid $blue100',
	opacity: '0',
	transition: 'all 0.2s ease',
	left: 1,
	zIndex: 0,
	padding: '1rem 0 0',
	overflowY: 'auto',

	'&::-webkit-scrollbar': {
		width: 2,
	},
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 32,
		background: '$white',
	},

	'.menuHeader': {
		// position: 'absolute',
		width: '100%',
		top: 18,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		fontSize: '2rem',
		color: '$white',
		textTransform: 'capitalize',

		span: {
			width: '100%',
			textAlign: 'center',
		},
		marginBottom: 24,
	},

	'.menuOptions': {
		// position: 'absolute',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		color: '$white',
		borderBottom: '1px solid $white',

		padding: '1rem 0',
	},

	'.content': {
		// height: '100%',
		width: '100%',
		borderTop: '1px solid $blue100',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '0',
	},

	variants: {
		isActive: {
			true: {
				opacity: '1',
				zIndex: 2,
				'@bp3': {
					left: 80,
					zIndex: 0,
				},
			},
			false: {
				zIndex: 0,
			},
		},
		hasGap: {
			true: {
				'.content': {
					gap: 24,
				},
			},
			false: {
				'.content': {
					gap: 0,
				},
			},
		},
	},

	'@bp1': {
		width: 260,

		'&::-webkit-scrollbar': {
			width: 4,
		},
	},

	'@bp3': {
		borderRadius: '0',
	},
})

export const PageContainer = styled('div', {
	// flex: '1 1 70%',
	height: 'calc(100%)',
	width: 'calc(100%)',
	transition: 'all 0.1s ease',
	marginLeft: 32,

	'@bp1': {
		marginLeft: 40,
	},

	'@bp3': {
		marginLeft: 80,
	},

	variants: {
		isSidePanelActive: {
			true: {
				'@bp3': {
					marginLeft: 340,
				},
			},
		},
	},
})
