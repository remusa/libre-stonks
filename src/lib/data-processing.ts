import type { TickerDataType } from './types'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function formatAlphaAdvantage(data: any) {
	return {
		ticker: data['1. symbol'],
		name: data['2. name'],
		type: data['3. type'],
		region: data['4. region'],
		timezone: data['7. timezone'],
		currency: data['8. currency'],
		// for search
		value: `${data['1. symbol']} ${data['2. name']}`,
		label: data['2. name'],
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function formatPolygon(data: any) {
	return {
		ticker: data.ticker,
		name: data.name,
		market: data.market,
		locale: data.locale,
		primary_exchange: data.primary_exchange,
		type: data.type,
		active: data.active,
		currency_name: data.currency_name,
		cik: data.cik,
		composite_figi: data.composite_figi,
		share_class_figi: data.share_class_figi,
		last_updated_utc: data.last_updated_utc,
		source_feed: data.source_feed,
		// for search
		value: `${data.ticker} ${data.name}`,
		label: data.name,
	}
}

export function getTickerList(tickers: TickerDataType[]) {
	return tickers.map((item) => item.ticker_name).join(',')
}
