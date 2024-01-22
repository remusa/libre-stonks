import notify from '$lib/notifications'

const portfolio = new Map()

export async function addToPortfolio(ticker) {
	// @ts-ignore
	// TODO: type API responses
	const key = ticker?.ticker
	if (!key || portfolio.has(key)) {
		return
	}
	portfolio.set(key, ticker)
	notify('Success!', `'${key}' has been added to the portfolio.`)
}

export function removeFromPortfolio(ticker_name: string) {
	if (!ticker_name || !portfolio.has(ticker_name)) {
		return
	}
	portfolio.delete(ticker_name)
}
