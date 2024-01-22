import * as stores from '$lib/stores/stores'

export const API_KEY_POLYGON = await stores.getValue(stores.settingsStore, 'api-key-polygon')
export const API_KEY_ALPHA_VANTAGE = await stores.getValue(
	stores.settingsStore,
	'api-key-alpha-vantage',
)
export const API_KEY_IEX_CLOUD = await stores.getValue(stores.settingsStore, 'api-key-iex-cloud')
export const API_ENDPOINT = await stores.getValue(stores.settingsStore, 'api-endpoint')
