import { getAlphaAdvantage } from '../data'
import { getValue, store } from '../stores/stores'

const API_KEY = await getValue(store, 'api-key-alpha-vantage')
const ENDPOINT = 'https://www.alphavantage.co'

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
			`${ENDPOINT}/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=${API_KEY}`,
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
