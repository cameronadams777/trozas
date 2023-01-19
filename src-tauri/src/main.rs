#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{env, fs, path::Path};

const CONFIG_FILE_NAME: &str = "config.json";

fn get_or_build_config_dir() -> String {
    let home_path = home::home_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .unwrap();

    // Handle .config dir
    let dot_config_directory_name = match env::consts::OS {
        "windows" => "\\.config",
        _ => "/.config"
    };

    let global_config_path = format!("{}{}", home_path, dot_config_directory_name);

    if !Path::new(&global_config_path).is_dir() {
        fs::create_dir(global_config_path).unwrap();
    }

    // Handle app directory
    let app_config_directory_name = match env::consts::OS {
        "windows" => "\\.config\\log-viewer",
        _ => "/.config/log-viewer"
    };

    let config_path = format!("{}{}", home_path, app_config_directory_name);

    let config_file_path = format!("{}{}", config_path, CONFIG_FILE_NAME);

    if !Path::new(&config_path).is_dir() {
        fs::create_dir(config_path).unwrap();
    }

    if !Path::new(&config_file_path).is_file() {
        fs::write(&config_file_path, "{}").unwrap();
    }

    return config_file_path;
}

#[tokio::main]
async fn main() {
    let _ = get_or_build_config_dir();
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn save_connection_details(instance_url: &str, api_token: &str) -> bool {
    // Attempt to make api call to instance url using api_token
    // If successful, save details in config.json and return true
    // Else, return false
}
