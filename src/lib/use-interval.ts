import { onMount } from 'svelte'

export function useInterval(fn: () => void, milliseconds: number) {
	onMount(() => {
		// Set up the interval to update the clock every X seconds
		const interval = setInterval(fn, milliseconds)

		// Initial call to set the clock immediately
		fn()

		// Cleanup on component destroy
		return () => clearInterval(interval)
	})
}
