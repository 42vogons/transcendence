import { login, logout, updateUser } from '@/reducers/User/Action'
import { UserReducer } from '@/reducers/User/Reducer'
import { iUser } from '@/reducers/User/Types'
import { ReactNode, createContext, useEffect, useReducer } from 'react'

interface UserContextType {
	user: iUser | undefined
	handleLogin: (user: iUser | undefined) => void
	handleLogout: () => void
}

interface UserProviderProps {
	children: ReactNode
}

export const UserContext = createContext({} as UserContextType)

export function UserProvider({ children }: UserProviderProps) {
	const [state, dispatch] = useReducer(UserReducer, {
		user: undefined,
	})

	const { user } = state

	function handleUpdateUser() {
		dispatch(updateUser())
	}
	function handleLogin(user: iUser | undefined) {
		dispatch(login(user))
	}

	function handleLogout() {
		dispatch(logout())
	}

	useEffect(() => {
		handleUpdateUser()
	}, [])

	useEffect(() => {
		console.log('userChanged:', user)
	}, [user])

	return (
		<UserContext.Provider
			value={{
				user,
				handleLogin,
				handleLogout,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}
