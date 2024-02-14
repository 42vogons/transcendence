import { useEffect, useRef } from 'react'

export const useOutsideClick = (callback: () => void) => {
	const ref = useRef<any>()

	useEffect(() => {
		const handleClick = (event: Event) => {
			// todo: resolver bug do click outside quando o menu ta mobile e no friends
			console.log('ref:', ref)
			console.log('event.target:', event.target)
			if (ref.current && !ref.current.contains(event.target)) {
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
