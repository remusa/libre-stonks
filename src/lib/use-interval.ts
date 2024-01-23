import { onMount } from 'svelte'

export function useInterval(fn: () => void, ms: number) {
	onMount(() => {
		// Set up the interval to update the clock every X seconds
		const interval = setInterval(fn, ms)

		// Initial call to set the clock immediately
		fn()

		// Cleanup on component destroy
		return () => clearInterval(interval)
	})
}
