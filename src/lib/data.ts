export function getAlphaAdvantage(data) {
	return {
		symbol: data["1. symbol"],
		name: data["2. name"],
		type: data["3. type"],
		region: data["4. region"],
		timezone: data["7. timezone"],
		currency: data["8. currency"],
	}
}