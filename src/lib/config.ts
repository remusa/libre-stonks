import * as stores from '$lib/stores/stores'

export const API_KEY_POLYGON = await stores.getValue(stores.settingsStore, 'api-key-polygon')
export const API_KEY_ALPHA_VANTAGE = await stores.getValue(
	stores.settingsStore,
	'api-key-alpha-vantage',
)
