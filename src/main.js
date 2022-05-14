import Vue from "vue";
import App from "./App";
import router from "./router/index";

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";
import store from './store'
import vuetify from './plugins/vuetify'
import EnlargeableImage from '@diracleo/vue-enlargeable-image';
import VCreditCard from 'v-credit-card';

Vue.use(EnlargeableImage)
Vue.use(PaperDashboard)
Vue.component('v-credit-card', VCreditCard);

/* eslint-disable no-new */
new Vue({
 router,
 store,
 vuetify,
 render: h => h(App)
}).$mount("#app");
