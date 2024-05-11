import * as config from '$lib/config'
import * as dataProcessing from '$lib/data-processing'
import * as errors from '$lib/errors'
import type { TickerDataType } from '$lib/types'
import { fetch } from '@tauri-apps/plugin-http'

const ENDPOINT = 'https://api.twelvedata.com'

export async function search(keywords: string) {
	try {
		const apiUrl = `${ENDPOINT}/v3/reference/tickers?search=${keywords}&active=true&apiKey=${config.API_KEY_TWELVE_DATA}`
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
		const apiUrl = `${ENDPOINT}/reference/tickers?apiKey=${config.API_KEY_TWELVE_DATA}&ticker=${ticker}`
		const response = await fetch(apiUrl, { method: 'GET' })
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		const data = json?.results.map(dataProcessing.formatTwelveData)
		return data
	} catch (error) {
		errors.handleEndpointError(error)
	}
}

type Interval =
	| '1min'
	| '5min'
	| '15min'
	| '30min'
	| '45min'
	| '1h'
	| '2h'
	| '4h'
	| '1day'
	| '1week'
	| '1month'

export async function update(tickers: TickerDataType[], interval: Interval = '1min') {
	try {
		const tickerList = dataProcessing.getTickerList(tickers)
		const apiUrl = `${ENDPOINT}/time_series?apikey=${config.API_KEY_TWELVE_DATA}&interval=${interval}&symbol=${tickerList}`
		const response = await fetch(apiUrl, { method: 'GET' })
		console.log('🚀 ~ update ~ response:', response)
		if (!response.ok) {
			throw Error('Response failed')
		}
		const json = await response.json()
		console.log('🚀 ~ update ~ json:', json)
		const data = json.map(dataProcessing.formatTwelveData)
		return data
	} catch (error) {
		errors.handleEndpointError(error)
		return []
	}
}
