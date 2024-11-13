import { createApp } from 'vue';
import './assets/style.css';
import App from './App.vue';
import router from './router';
import Notifications from '@kyvg/vue3-notification';
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "en",
    fallbackLocale: "en",
    availableLocales: ["en", "es"],
    messages: messages,
});

createApp(App).use(router).use(Notifications).use(i18n).use(VueAwesomePaginate).mount('#app');
