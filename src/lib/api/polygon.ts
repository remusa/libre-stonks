import * as config from '$lib/config'
import * as dataProcessing from '$lib/data-processing'
import type { TickerDataType } from '$lib/types'
import { fetch } from '@tauri-apps/plugin-http'

const ENDPOINT = 'https://api.polygon.io/v3/reference'

export async function search(keywords: string) {
	try {
		const apiUrl = `https://api.polygon.io/v3/reference/tickers?search=${keywords}&active=true&apiKey=${config.API_KEY_POLYGON}`
		const response = await fetch(apiUrl, { method: 'GET' })
		if (!response.ok) {
			throw Error(response.statusText)
		}
		const json = await response.json()
		const data = json?.results.map(dataProcessing.formatPolygon) ?? []
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
		const apiUrl = `${ENDPOINT}/reference/tickers?apiKey=${config.API_KEY_POLYGON}&ticker=${ticker}`
		const response = await fetch(apiUrl, { method: 'GET' })
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.results.map(dataProcessing.formatPolygon) ?? []
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
	try {
		const tickerList = dataProcessing.getTickerList(tickers)
		const apiUrl = `${ENDPOINT}/reference/tickers?apiKey=${config.API_KEY_POLYGON}&ticker=${tickerList}`
		const response = await fetch(apiUrl, { method: 'GET' })
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.results.map(dataProcessing.formatPolygon) ?? []
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
