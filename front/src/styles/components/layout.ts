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
		border: '6px solid $white',
	},
})

export const SidebarContainer = styled('div', {
	position: 'absolute',
	top: 0,
	width: 30,
	height: '100%',
	backgroundColor: '$blue100',
	borderRadius: '30px 0 0 30px',

	'@bp1': {
		width: 40,
		borderRadius: '26px 0 0 26px',
	},
})

export const SidePanelContainer = styled('div', {
	// flex: '1 1 30%',
	display: 'none',
	minWidth: 350,
	height: '100% - 12px',
	backgroundColor: '$red',
	borderRadius: '26px 0 0 26px',

	'@bp3': {
		display: 'block',
	},
})

export const PageContainer = styled('div', {
	// flex: '1 1 70%',
	height: 'calc(100%)',
	width: 'calc(100%)',
	marginLeft: 30,

	'@bp1': {
		marginLeft: 40,
	},

	'@bp3': {
		marginLeft: 0,
	},
})
