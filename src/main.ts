import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css'; //Optional default CSS
import SimpleTypeahead from 'vue3-simple-typeahead';
import mitt from "mitt";

const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
app.config.globalProperties.emitter.emit("modal-transaksi-done", false);
app.config.globalProperties.$filters = {
    formatNumber(number: number | bigint) {
        return Intl.NumberFormat().format(number);
    }
}

app.use(SimpleTypeahead);
app.use(createPinia());
app.use(router);
app.mount("#app");
