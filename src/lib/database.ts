import Database from '@tauri-apps/plugin-sql'
import type { CurrencyType, MarketType, TickerDataType, TickerInsertType } from './types'

const DATABASE = 'data.db'
const db = await Database.load(`sqlite:${DATABASE}`)

const markets: MarketType[] = await db.select('SELECT * from market;')
const marketMap = new Map()
for (const market of markets) {
	marketMap.set(market.market_code, market)
}

const currencies: CurrencyType[] = await db.select('SELECT * from currency;')
const currencyMap = new Map()
for (const currency of currencies) {
	currencyMap.set(currency.currency_code, currency)
}

export async function insert(tickers: TickerInsertType[] = []) {
	const query = `
	INSERT INTO ticker (ticker_name, ticker_long_name, market_id, currency_id)
	VALUES ($1, $2, $3, $4);
	`
	const result = await db.execute(query, [
		// @ts-ignore
		tickers.ticker_name,
		// @ts-ignore
		tickers.ticker_long_name,
		// @ts-ignore
		marketMap.get(tickers.market_id),
		// @ts-ignore
		currencyMap.get(tickers.currency_id),
	])
	return result
}

export async function get() {
	const query = `
	SELECT
		t.ticker_name,
		t.ticker_long_name,
		m.market_code,
		c.currency_code
	FROM
		ticker t
	JOIN
		market m ON t.market_id = m.market_id
	JOIN
		currency c ON t.currency_id = c.currency_id;
	`
	const result = await db.select(query)
	return result
}

export async function refetch() {
	tickers = (await get()) as TickerDataType[]
}

export let tickers = (await get()) as TickerDataType[]

// export async function updateTodos(todos = []) {
// 	const result = await db.execute('UPDATE todos SET title = $1, completed = $2 WHERE id = $3', [
// 		todos.title,
// 		todos.status,
// 		todos.id,
// 	])
// }
