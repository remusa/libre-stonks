import { API_KEY_POLYGON } from '$lib/config'
import { formatPolygon } from '$lib/data'

const ENDPOINT = 'https://api.polygon.io/v3/reference'

export async function search(keywords: string) {
	try {
		const apiUrl = `https://api.polygon.io/v3/reference/tickers?search=${keywords}&active=true&apiKey=${API_KEY_POLYGON}`
		const response = await fetch(apiUrl, { method: 'GET' })
		if (!response.ok) {
			throw Error(response.statusText)
		}
		const json = await response.json()
		const data = json?.results.map(formatPolygon) ?? []
		return data
	} catch (error) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.log('There was a SyntaxError', error)
		} else {
			console.log('There was an error', error)
		}
	}
}

export async function getSymbol(ticker: string) {
	try {
		const apiUrl = `${ENDPOINT}/reference/tickers?apiKey=${API_KEY_POLYGON}}&ticker=${ticker}}`
		const response = await fetch(apiUrl, { method: 'GET' })
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.results.map(formatPolygon) ?? []
		return data
	} catch (error) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.log('There was a SyntaxError', error)
		} else {
			console.log('There was an error', error)
		}
	}
}
