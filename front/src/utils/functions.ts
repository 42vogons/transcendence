export async function delayMs(value: number) {
	return await new Promise((resolve) => setTimeout(resolve, value))
}

export function capitalize(s: string) {
	return s[0].toUpperCase() + s.slice(1)
}
