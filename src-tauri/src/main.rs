#![allow(non_snake_case)]
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use radix64::STD;
use serde::{Serialize, Deserialize};
//use futures_util::StreamExt;
//use tokio_tungstenite::connect_async;
//use tokio::io::AsyncWriteExt;
use std::{
    path::Path, 
    collections::HashMap,
    env, 
    fs
};

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
        "windows" => "\\.config\\trozas",
        _ => "/.config/trozas"
    };

    let config_path = format!("{}{}", home_path, app_config_directory_name);

    let config_file_path = format!("{}/{}", config_path, CONFIG_FILE_NAME);

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
        /*.setup(|app| {
            // Spawn new thread that handles websocket connections
            thread::spawn(|| async {
                // Connect to rancher logs ws endpoint
                let url = url::Url::parse(&RANCHER_LOGS_URL).unwrap();

                let (_, stdin_rx) = futures_channel::mpsc::unbounded();

                let (ws_stream, _) = connect_async(url).await.expect("Failed to connect.");
                println!("WebSocket handshake has been successfully completed");

                let (_, read) = ws_stream.split();
                
                let read_future = read.for_each(|message| async {
                    println!("receiving...");
                    let data = message.unwrap().into_data();
                    tokio::io::stdout().write(&data).await.unwrap();
                    println!("received!");
                });

                read_future.await;

                // Pipe logs out and convert them into a formatter

                // After logs have been formatted properly, create a batch of logs

                // Once batch reaches threshold _or_ a timer has completed, emit an event 
                // to the webview for displaying
            });
            Ok(())
        })*/
        .invoke_handler(tauri::generate_handler![
            get_connection_details,
            save_connection_details,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/* Generic function for saving to application config file */
fn save_config<'a>(key: &'a str, value: String) {
    let config_file_path = get_or_build_config_dir();
    let config_as_string = fs::read_to_string(&config_file_path).unwrap();
    let mut config = serde_json::from_str::<HashMap<&str, String>>(&config_as_string.as_str()).unwrap();
    config.insert(key, value);
    let _ = fs::write(&config_file_path, serde_json::to_string_pretty(&config).unwrap());
}

#[derive(Debug, Serialize, Deserialize)]
struct AppConfig {
    connection_details: ConnectionDetails,
}

#[derive(Debug, Serialize, Deserialize)]
struct ConnectionDetails {
    instanceUrl: String,
    apiToken: String,
}

#[tauri::command]
fn get_connection_details() -> Result<ConnectionDetails, ConnectionDetails> {
    let config_file_path = get_or_build_config_dir();
    let config_as_string = fs::read_to_string(&config_file_path).unwrap();
    let config = serde_json::from_str::<HashMap<&str, String>>(&config_as_string.as_str()).unwrap();
    let empty_connection_details = ConnectionDetails { instanceUrl: "".to_string(), apiToken: "".to_string() };
    let connection_details = match config.get("connection_details") {
        Some(res) => {
            match serde_json::from_str::<ConnectionDetails>(res) {
                Ok(deserialized_config) => Ok(deserialized_config),
                Err(_) => Err(empty_connection_details),
            }
        },
        None => Ok(empty_connection_details),
    };
    return connection_details;
}

#[tauri::command]
async fn save_connection_details(instance_url: String, api_token: String) -> Result<ConnectionDetails, String> {
    let client = reqwest::Client::new();
    // Attempt to make api call to instance url using api_token
    let resp = client.get(format!("{}/v3/users?me=true", instance_url))
        .header("Authorization", format!("Basic {}", api_token))
        .send()
        .await;

    match resp {
        Ok(_) => {
            let connection_details = ConnectionDetails {
                instanceUrl: instance_url,
                apiToken: STD.encode(&api_token),
            };
            match serde_json::to_string(&connection_details) {
                Ok(serialized_connection_details) => {
                    save_config("connection_details", serialized_connection_details); 
                    Ok(connection_details)
                },
                Err(_) => Err("Error: Could not serialize connection details.".to_string())
            }
        },
        Err(_) => Err("Error: Invalid connection details.".to_string()),
    }
}
