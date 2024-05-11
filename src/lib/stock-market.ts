import marketHolidays from '../data/market-holidays.json'

export function isStockMarketHoliday(date: Date) {
	// Check if today is a market holiday
	const formattedDate = date.toISOString().split('T')[0] // Get the date in "YYYY-MM-DD" format
	const checkIsHoliday = marketHolidays.some((holiday) => holiday.date === formattedDate)
	return checkIsHoliday
}

export function isStockMarketOpen(date: Date) {
	// Check if it's a weekend (Saturday or Sunday)
	const dayOfWeek = date.getDay()
	if (dayOfWeek === 0 || dayOfWeek === 6) {
		return false
	}

	// Check if the time is within typical trading hours (9:30 AM - 4:00 PM)
	const hours = date.getHours()
	const minutes = date.getMinutes()
	const currentTimeInMinutes = hours * 60 + minutes

	const marketOpenTimeInMinutes = 9 * 60 + 30 // 9:30 AM
	const marketCloseTimeInMinutes = 16 * 60 // 4:00 PM

	return (
		currentTimeInMinutes >= marketOpenTimeInMinutes &&
		currentTimeInMinutes <= marketCloseTimeInMinutes
	)
}
