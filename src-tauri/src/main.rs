// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use window_shadows::set_shadow;
use window_vibrancy::{apply_acrylic, apply_blur, apply_vibrancy, NSVisualEffectMaterial};

fn main() {
    libre_stocks_lib::run();

    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            // apply_blur(&window, Some((18, 18, 18, 125)))
            apply_acrylic(&window, Some((0, 0, 0, 10)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            #[cfg(any(windows, target_os = "macos"))]
            window.set_shadow(true).unwrap();
            // set_shadow(&window, true).unwrap();

            Ok(())
        })
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
