import { formatAlphaAdvantage } from '../data'
import { getValue, store } from '../stores/stores'

const API_KEY = await getValue(store, 'api-key-alpha-vantage')
const ENDPOINT = 'https://www.alphavantage.co'

export async function search(keywords: string) {
	try {
		const response = await fetch(
			`${ENDPOINT}SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`,
			{
				method: 'GET',
			},
		)
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.bestMatches.map(formatAlphaAdvantage) ?? []
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
		const response = await fetch(
			`${ENDPOINT}/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=${API_KEY}`,
			{
				method: 'GET',
			},
		)
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.bestMatches.map(formatAlphaAdvantage) ?? []
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
