import { z } from 'zod'

const MarketSchema = z.object({
	market_code: z.string(),
	market_id: z.number(),
	market_name: z.string(),
})

const CurrencySchema = z.object({
	currency_code: z.string(),
	currency_id: z.number(),
	currency_name: z.string(),
})

const TickerInsertSchema = z.object({
	ticker_name: z.string(),
	ticker_long_name: z.string(),
	market_id: z.number(),
	currency_id: z.number(),
})

const TickerDataSchema = z.object({
	currency_code: z.string(),
	market_code: z.string(),
	ticker_long_name: z.string(),
	ticker_name: z.string(),
})

export type MarketType = z.infer<typeof MarketSchema>
export type CurrencyType = z.infer<typeof CurrencySchema>
export type TickerInsertType = z.infer<typeof TickerInsertSchema>
export type TickerDataType = z.infer<typeof TickerDataSchema>
