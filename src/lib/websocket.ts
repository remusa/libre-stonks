import WebSocket from '@tauri-apps/plugin-websocket'

const WS_URL = 'wss://socket.polygon.io/stocks'

const ws = await WebSocket.connect(WS_URL)

await ws.send('Hello World')

await ws.disconnect()
