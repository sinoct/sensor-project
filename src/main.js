import { createApp } from 'vue';
import VueClickAway from 'vue3-click-away';
import App from './App.vue';
import mitt from 'mitt';

const eventBus = mitt()
const app = createApp(App)

app.config.globalProperties.eventBus = eventBus
app.use(VueClickAway);
app.mount('#app')