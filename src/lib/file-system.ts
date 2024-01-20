import { invoke } from "@tauri-apps/api/core"
import { appConfigDir, appDataDir, appLocalDataDir } from "@tauri-apps/api/path"

export async function show_in_folder(path: string) {
	await invoke("show_in_folder", { path })
}

export async function openBaseDir() {
	const baseDir = await appLocalDataDir()
	show_in_folder(baseDir)
}

export async function openConfigDir() {
	const configDir = await appConfigDir()
	// NOTE: await open(configDir) there is an issue to open explorer: https://github.com/tauri-apps/tauri/issues/4062
	show_in_folder(configDir)
}
