import { Store } from '@tauri-apps/plugin-store'

export function createStore(storeName: string) {
	const store = new Store(storeName)
	return store
}

export async function setValue(store: Store, key: string, value: string) {
	if (!store || !key || !value) {
		return
	}
	await store.set(key, value)
	await store.save()
}

export async function getValue(store: Store, key: string) {
	if (!store || !key) {
		return
	}
	const val = await store.get(key)
	return val
}

export const store = createStore('.settings.dat')
