#[cfg(target_os = "linux")]
use fork::{daemon, Fork};
use std::fs;
use std::path::PathBuf;
use std::process::Command;
#[cfg(target_os = "linux")]
use std::{fs::metadata, path::PathBuf}; // dep: fork = "0.1"
use tauri_plugin_sql::{Builder, Migration, MigrationKind};

#[tauri::command]
fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path]) // The comma after select is not a typo
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "linux")]
    {
        if path.contains(",") {
            // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
            let new_path = match metadata(&path).unwrap().is_dir() {
                true => path,
                false => {
                    let mut path2 = PathBuf::from(path);
                    path2.pop();
                    path2.into_os_string().into_string().unwrap()
                }
            };
            Command::new("xdg-open").arg(&new_path).spawn().unwrap();
        } else {
            if let Ok(Fork::Child) = daemon(false, false) {
                Command::new("dbus-send")
                    .args([
                        "--session",
                        "--dest=org.freedesktop.FileManager1",
                        "--type=method_call",
                        "/org/freedesktop/FileManager1",
                        "org.freedesktop.FileManager1.ShowItems",
                        format!("array:string:\"file://{path}\"").as_str(),
                        "string:\"\"",
                    ])
                    .spawn()
                    .unwrap();
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open").args(["-R", &path]).spawn().unwrap();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            // ticker: data.ticker,
            // name: data.name,
            // market: data.market,
            // locale: data.locale,
            // primary_exchange: data.primary_exchange,
            // type: data.type,
            // active: data.active,
            // currency_name: data.currency_name,
            // cik: data.cik,
            // composite_figi: data.composite_figi,
            // share_class_figi: data.share_class_figi,
            // last_updated_utc: data.last_updated_utc,
            // source_feed: data.source_feed,
            sql: "
            -- Drop the tables if they exist
            DROP TABLE IF EXISTS ticker;
            DROP TABLE IF EXISTS market;
            DROP TABLE IF EXISTS currency;

            -- Create 'market' table
            CREATE TABLE market (
                market_id INTEGER PRIMARY KEY,
                market_name TEXT NOT NULL,
                market_code TEXT NOT NULL
            );

            -- Create 'currency' table
            CREATE TABLE currency (
                currency_id INTEGER PRIMARY KEY,
                currency_name TEXT NOT NULL,
                currency_code TEXT NOT NULL
            );

            -- Create 'ticker' table with foreign keys referencing 'market' and 'currency' tables
            CREATE TABLE ticker (
                ticker_id INTEGER PRIMARY KEY,
                ticker_name TEXT NOT NULL,
                market_id INTEGER,
                currency_id INTEGER,
                FOREIGN KEY (market_id) REFERENCES market(market_id),
                FOREIGN KEY (currency_id) REFERENCES currency(currency_id)
            );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "seed_tables",
            sql: "
            -- Seed 'market' table
            INSERT INTO market (market_name, market_code) VALUES ('Stock', 'stocks');
            INSERT INTO market (market_name, market_code) VALUES ('Index', 'indices');

            -- Seed 'currency' table
            INSERT INTO currency (currency_name, currency_code) VALUES ('US Dollar', 'USD');
            INSERT INTO currency (currency_name, currency_code) VALUES ('Euro', 'EUR');

            -- Seed data for tickers
            INSERT INTO ticker (ticker_name, market_id, currency_id) VALUES ('AAPL', 1, 1);
            INSERT INTO ticker (ticker_name, market_id, currency_id) VALUES ('GOOGL', 1, 1);
            INSERT INTO ticker (ticker_name, market_id, currency_id) VALUES ('FB', 1, 1);
            INSERT INTO ticker (ticker_name, market_id, currency_id) VALUES ('AMZN', 1, 1);
            INSERT INTO ticker (ticker_name, market_id, currency_id) VALUES ('NFLX', 1, 1);
            ",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_websocket::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:data.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![show_in_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
