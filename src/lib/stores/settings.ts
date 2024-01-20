import { Store } from '@tauri-apps/plugin-store'

export const settingsStore = new Store('.settings.dat')

await settingsStore.set('some-key', { value: 5 })

const val = await settingsStore.get('some-key')

await settingsStore.save()
