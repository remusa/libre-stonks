import { getAlphaAdvantage } from './data'
import { getValue, store } from './stores/stores'

const ENDPOINT = 'https://www.alphavantage.co/query?function='
const API_KEY = await getValue(store, 'api-key')

export async function getSymbolAlphaVantage(keywords: string) {
	try {
		const response = await fetch(
			`${ENDPOINT}SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`,
			{
				method: 'GET',
			},
		)
		if (response.status !== 200) {
			return
		}
		const json = await response.json()
		const data = json?.bestMatches.map(getAlphaAdvantage) ?? []
		return data
	} catch (e) {
		console.log('🚀 ~ getSymbol ~ e:', e)
		return []
	}
}

export async function getSymbolPolygon(keywords: string) {
	try {
		const response = await fetch(
			`${ENDPOINT}SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`,
			{
				method: 'GET',
			},
		)
		if (response.status !== 200) {
			return
		}
		const json = await response.json()
		const data = json?.bestMatches.map(getAlphaAdvantage) ?? []
		return data
	} catch (e) {
		console.log('🚀 ~ getSymbol ~ e:', e)
		return []
	}
}
