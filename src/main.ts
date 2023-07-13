import { createApp } from "vue";
import { createPinia } from "pinia";
import { RancherClientPlugin } from "src/plugins/rancher-client";
import { RancherClient } from "src/lib/rancher-client";
import { getConnectionDetails } from "src/lib/trozas";
import router from "src/router";
import App from "./App.vue";
import "@unocss/reset/normalize.css";
import "virtual:uno.css";

const connectionDetails = await getConnectionDetails();
const rancherClient = new RancherClient(connectionDetails);

const app = createApp(App);
const pinia = createPinia();

// Apply Vue plugins
app.use(RancherClientPlugin, { client: rancherClient });
app.use(pinia);
app.use(router);

// Mount app
app.mount("#app");
