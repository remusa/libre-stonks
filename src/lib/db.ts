import Database from '@tauri-apps/plugin-sql'
import type { CurrencyType, MarketType, TickerInsertType } from './types'

const db = await Database.load('sqlite:data.db')

const markets: MarketType[] = await db.select('SELECT * from market;')
const currencies: CurrencyType[] = await db.select('SELECT * from currency;')

const marketMap = new Map()
const currencyMap = new Map()

for (const market of markets) {
	marketMap.set(market.market_code, market)
}

for (const currency of currencies) {
	currencyMap.set(currency.currency_code, currency)
}

export async function insert(tickers: TickerInsertType[] = []) {
	const query = `
	INSERT INTO ticker (ticker_name, market_id, currency_id)
	VALUES ('GOOGL', 1, 1); -- Google stock, Stocks market, USD currency
	`
	const result = await db.execute(query, [
		// @ts-ignore
		tickers.ticker_name,
		// @ts-ignore
		tickers.market_id,
		// @ts-ignore
		tickers.currency_id,
	])
}

// export async function updateTodos(todos = []) {
// 	const result = await db.execute('UPDATE todos SET title = $1, completed = $2 WHERE id = $3', [
// 		todos.title,
// 		todos.status,
// 		todos.id,
// 	])
// }
