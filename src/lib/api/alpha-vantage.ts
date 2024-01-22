import * as config from '$lib/config'
import * as dataProcessing from '$lib/data-processing'
import type { TickerDataType } from '$lib/types'
import { fetch } from '@tauri-apps/plugin-http'

// TODO: implement Alpha Vantage
const ENDPOINT = 'https://www.alphavantage.co'

export async function search(keywords: string) {
	try {
		const response = await fetch(
			`${ENDPOINT}SYMBOL_SEARCH&keywords=${keywords}&apikey=${config.API_KEY_ALPHA_VANTAGE}`,
			{
				method: 'GET',
			},
		)
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.bestMatches.map(dataProcessing.formatAlphaAdvantage) ?? []
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
			`${ENDPOINT}/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=${config.API_KEY_ALPHA_VANTAGE}`,
			{
				method: 'GET',
			},
		)
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.bestMatches.map(dataProcessing.formatAlphaAdvantage) ?? []
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

export async function update(tickers: TickerDataType[]) {
	console.log('🚀 ~ update ~ tickers:', tickers)
}
