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
