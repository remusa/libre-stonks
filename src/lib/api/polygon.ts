import { getAlphaAdvantage } from '../data'
import { getValue, store } from '../stores/stores'

const API_KEY = await getValue(store, 'api-key-polygon')
const ENDPOINT = 'https://api.polygon.io/v2'

async function findSymbol(keywords: string) {
	try {
		const response = await fetch(
			`${ENDPOINT}SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`,
			{
				method: 'GET',
			},
		)
		if (response.status !== 200) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.bestMatches.map(getAlphaAdvantage) ?? []
		return data
	} catch (e) {
		console.log('🚀 ~ getSymbol ~ e:', e)
		return []
	}
}

async function getSymbol(ticker: string) {
	try {
		const response = await fetch(
			`${ENDPOINT}/aggs/ticker/${ticker}/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`,
			{
				method: 'GET',
			},
		)
		if (response.status !== 200) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.bestMatches.map(getAlphaAdvantage) ?? []
		return data
	} catch (e) {
		console.log('🚀 ~ getSymbol ~ e:', e)
		return []
	}
}

export { findSymbol, getSymbol }
