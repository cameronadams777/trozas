#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

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
const RANCHER_LOGS_URL: &str = "wss://rancher.mrcooper.io/k8s/clusters/c-kn68m/api/v1/namespaces/dev/pods/gke-apollo-mrc-helpcenter-web-dev-9bcf89678-hqf6c/log?previous=false&follow=true&timestamps=true&pretty=true&container=apollo-mrc-help-center&sinceSeconds=43200&sockId=8";

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
            save_connection_details,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/* Generic function for saving to application config file */
fn save_config<'a>(key: &'a str, value: String) {
    let config_file_path = get_or_build_config_dir();
    let config_as_string = fs::read_to_string(&config_file_path).unwrap();
    let mut config: HashMap<&str, String> = serde_json::from_str(&config_as_string.as_str()).unwrap();

    config.insert(key, value);
    let _ = fs::write(&config_file_path, serde_json::to_string_pretty(&config).unwrap());
}

#[derive(Debug, Serialize, Deserialize)]
struct AppConfig<'a> {
    #[serde(borrow)]
    connection_details: ConnectionDetails<'a>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ConnectionDetails<'a> {
    instance_url: &'a str,
    api_token: &'a str,
}

#[tauri::command]
async fn save_connection_details<'a>(instance_url: &'a str, api_token: &'a str) -> Result<ConnectionDetails<'a>, &'a str> {
    let client = reqwest::Client::new();
    // Attempt to make api call to instance url using api_token
    let resp = client.get(format!("{}/v3/users?me=true", instance_url))
        .header("Authorization", format!("Basic {}", api_token))
        .send()
        .await;

    match resp {
        Ok(_) => {
            let connection_details = ConnectionDetails {
                instance_url: &instance_url,
                api_token: &api_token,
            };
            match serde_json::to_string(&connection_details) {
                Ok(serialized_connection_details) => {
                    save_config("connection_details", serialized_connection_details); 
                    Ok(connection_details)
                },
                Err(_) => Err("Error: Could not serialize connection details.")
            }
        },
        Err(_) => Err("Error: Invalid connection details."),
    }
}
