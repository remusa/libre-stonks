import * as config from '$lib/config'
import {
	isPermissionGranted,
	requestPermission,
	sendNotification,
} from '@tauri-apps/plugin-notification'

async function notifyNative(title: string, body: string) {
	// Do you have permission to send a notification?
	let permissionGranted = await isPermissionGranted()

	// If not we need to request it
	if (!permissionGranted) {
		const permission = await requestPermission()
		permissionGranted = permission === 'granted'
	}

	// Once permission has been granted we can send the notification
	if (permissionGranted) {
		sendNotification({ title, body })
	}
}

// TODO: show toast using shadcn-svelte
async function notifyWeb(title: string, body: string) {}

export function notify(title: string, body: string) {
	const useNativeNotifications = localStorage.getItem('use-native-notifications') === 'true' || true
	if (useNativeNotifications) {
		notifyNative(title, body)
	} else {
		notifyWeb(title, body)
	}
}

export default notify
