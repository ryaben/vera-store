import { createApp } from 'vue';
import './assets/style.css';
import App from './App.vue';
import router from './router';
import Notifications from '@kyvg/vue3-notification';

createApp(App).use(router).use(Notifications).mount('#app');
