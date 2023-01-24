import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import 'uno.css';

const app = createApp(App);
const pinia = createPinia();

// Apply Vue plugins
app.use(pinia);

// Mount app
app.mount('#app')

