# Libre Stonks

## TODO

- [ ] Get stock data from API.
  - [ ] Fetch in the background.
  - [ ] Customize fetch time.
- [ ] Display price graphic.
- [x] Create database.
  - [x] Create schema.
  - [ ] Seed initial db.
  - [ ] Store stocks in database.
- [x] Search for a stock.
- [ ] Sort stocks by name/percentage/price.
- [x] Add portfolios in db.
  - [ ] Choose portfolio.
  - [ ] Create individual portfolios.
  - [ ] Add current holdings per portfolio.
- [ ] Implement tray menu.
  - [ ] Minimize to tray.
  - [ ] Close.
- [ ] Use SVG for currency icons.
- [ ] Create custom app icon.
- [ ] Alert when price goes above/below threshold.
- [x] Add "Settings" screen
  - [x] Restore last screen when reopening tab (local storage).
  - [x] Toggle always on top.
  - [x] Store settings in file (tauri-plugin-store).
  - [x] Store api keys in settings file.
    - [x] Store encrypted keys using "stronghold" plugin.
  - [x] Toggle api keys visibility.
  - [ ] Implement API for Alpha Vantage.


- Update tauri deps:

```shell
ni -D svelte@next @sveltejs/adapter-static@next @sveltejs/vite-plugin-svelte@next

ni @tauri-apps/api@next @tauri-apps/cli@next

ni @tauri-apps/plugin-fs@latest @tauri-apps/plugin-http@latest @tauri-apps/plugin-notification@latest @tauri-apps/plugin-shell@latest @tauri-apps/plugin-sql@latest @tauri-apps/plugin-store@latest @tauri-apps/plugin-stronghold@latest @tauri-apps/plugin-websocket@latest @tauri-apps/plugin-window-state@latest
```
