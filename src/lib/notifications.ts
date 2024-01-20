import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification'

export async function notify(title: string, body: string) {
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
export async function toastify(title: string, body: string) {}