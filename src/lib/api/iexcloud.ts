import * as config from '$lib/config'
import * as dataProcessing from '$lib/data-processing'
import * as errors from '$lib/errors'
import type { TickerDataType } from '$lib/types'
import { fetch } from '@tauri-apps/plugin-http'

const ENDPOINT = 'https://api.iex.cloud/v1/data/core'

export async function search(keywords: string) {
	try {
		const apiUrl = `https://api.polygon.io/v3/reference/tickers?search=${keywords}&active=true&apiKey=${config.API_KEY_IEX_CLOUD}`
		const response = await fetch(apiUrl, { method: 'GET' })
		if (!response.ok) {
			throw Error(response.statusText)
		}
		const json = await response.json()
		const data = json?.results.map(dataProcessing.formatPolygon)
		return data
	} catch (error) {
		errors.handleEndpointError(error)
	}
}

export async function getSymbol(ticker: string) {
	try {
		const apiUrl = `${ENDPOINT}/reference/tickers?apiKey=${config.API_KEY_IEX_CLOUD}&ticker=${ticker}`
		const response = await fetch(apiUrl, { method: 'GET' })
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.results.map(dataProcessing.formatPolygon)
		return data
	} catch (error) {
		errors.handleEndpointError(error)
	}
}

export async function update(tickers: TickerDataType[]) {
	try {
		const tickerList = dataProcessing.getTickerList(tickers)
		const apiUrl = `${ENDPOINT}/quote/${tickerList}?token=${config.API_KEY_IEX_CLOUD}`
		const response = await fetch(apiUrl, { method: 'GET' })
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json.map(dataProcessing.formatIexCloud)
		return data
	} catch (error) {
		errors.handleEndpointError(error)

		return []
	}
}

// const year = new Date().getFullYear()

// export async function getMarketHolidays() {
// 	try {
// 		const response = await fetch(
// 			`https://cloud.iexapis.com/stable/ref-data/us/dates/holidays/${year}?token=${apiKey}`,
// 		)
// 		if (!response.ok) {
// 			throw new Error(`HTTP error! Status: ${response.status}`)
// 		}

// 		const holidays = await response.json()
// 		return holidays
// 	} catch (error) {
// 		console.error('Error fetching market holidays:', error.message)
// 		return []
// 	}
// }
