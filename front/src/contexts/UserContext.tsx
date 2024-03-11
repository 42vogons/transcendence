'use client'
import { login, logout } from '@/reducers/User/Action'
import { UserReducer, isDateExpired } from '@/reducers/User/Reducer'
import { iUser } from '@/reducers/User/Types'
import { api } from '@/services/api'
import { delayMs } from '@/utils/functions'
import { useRouter } from 'next/router'
import { ReactNode, createContext, useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'

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
	const [state, dispatch] = useReducer(
		UserReducer,
		{
			user: undefined,
		},
		(initialState) => {
			if (typeof window !== 'undefined') {
				const storedStateAsJSON = localStorage.getItem(
					'@42Transcendence:user',
				)
				console.log('storedStateAsJSON:', storedStateAsJSON)
				if (storedStateAsJSON) {
					const newUser = JSON.parse(storedStateAsJSON)
					if (newUser) {
						if (!isDateExpired(newUser.expiresAt)) {
							return { user: newUser }
						}
					}
				}
			}
			return initialState
		},
	)

	const { user } = state

	const router = useRouter()

	function handleLogin(user: iUser | undefined) {
		dispatch(login(user))
	}

	async function handleLogout() {
		try {
			await api.post('/logout')
			router.push('/login')
			await delayMs(100)
			dispatch(logout())
			toast('Logout successful.', {
				type: 'success',
			})
		} catch (error) {
			console.log('error:', error)
			toast('An error ocurred.', {
				type: 'error',
			})
		}
	}

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
