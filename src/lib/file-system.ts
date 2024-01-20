import { invoke } from "@tauri-apps/api/core"

export async function show_in_folder(path: string) {
	await invoke("show_in_folder", { path })
}
