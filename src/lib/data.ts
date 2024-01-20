// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getAlphaAdvantage(data: any) {
  return {
    symbol: data['1. symbol'],
    name: data['2. name'],
    type: data['3. type'],
    region: data['4. region'],
    timezone: data['7. timezone'],
    currency: data['8. currency'],
    // for search
    value: `${data['1. symbol']}-${data['2. name']}`,
    label: data['2. name'],
  }
}
