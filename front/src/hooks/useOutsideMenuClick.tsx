import { useEffect, useRef } from 'react'

export const useOutsideMenuClick = (callback: () => void) => {
	const ref = useRef<any>()

	useEffect(() => {
		const handleClick = (event: Event) => {
			if (
				ref.current &&
				!ref.current.contains(event.target) &&
				(event.target as HTMLElement).closest('.pageContainer')
			) {
				callback()
			}
		}

		document.addEventListener('click', handleClick, true)

		return () => {
			document.removeEventListener('click', handleClick, true)
		}
	}, [callback, ref])

	return ref
}
