import { invoke } from '@tauri-apps/api';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { RancherClient } from './lib/rancher-client';
import App from './App.vue';
import 'uno.css';

const connectionDetails = await invoke<IConnectionDetails>("get_connection_details");
RancherClient.initialize(connectionDetails);

const app = createApp(App);
const pinia = createPinia();

// Apply Vue plugins
app.use(pinia);

// Mount app
app.mount('#app')

