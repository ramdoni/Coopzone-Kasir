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
import Notifications from '@kyvg/vue3-notification'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Vue3Storage, { StorageType } from "vue3-storage";
import number from '@coders-tm/vue-number-format'

library.add(faClose);
const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
app.config.globalProperties.emitter.emit("modal-transaksi-done", false);
app.config.globalProperties.emitter.emit("modal-edit-product",{});
app.config.globalProperties.emitter.emit("set-focus-bayar-tunai",false);
app.config.globalProperties.emitter.emit("set-focus-bayar-kredit",false);
app.config.globalProperties.$filters = {
    formatNumber(number: number | bigint) {
        return Intl.NumberFormat().format(number);
    }
}
app.use(number, { precision: 4 })
app.use(Vue3Storage, { namespace: "pro_", storage: StorageType.Local });
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(Notifications);
app.use(SimpleTypeahead);
app.use(createPinia());
app.use(router);
app.mount("#app");