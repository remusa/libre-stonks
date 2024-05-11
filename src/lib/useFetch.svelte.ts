class TickersResponse {
	data = $state()
	error = $state()
	isLoading = $state(false)
}

export default function useFetchTickerData() {
	const resp = new TickersResponse()

	async function fetchData() {
		resp.isLoading = true
		try {
			const response = await fetch('https://randomuser.me/api/?results=3')
			resp.data = (await response.json()).results
			resp.error = undefined
		} catch (err) {
			resp.error = err
			resp.data = undefined
		}
		resp.isLoading = false
	}

	fetchData()
	return resp
}
