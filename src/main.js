import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Api from "./utils/Api";


Vue.config.productionTip = false

let apiUrl="https://recap.tw/im.api/api";
window.$api=new Api(apiUrl);
Vue.prototype.$api = Vue.observable(window.$api);

window.$db=new Db();
Vue.prototype.$db = Vue.observable(window.$db);

window.$utils=new Utils();
Vue.prototype.$utils = Vue.observable(window.$utils);

import VueLayers from 'vuelayers';
import Db from "@/Db";
import Utils from "@/utils/Utils";
Vue.use(VueLayers, {
    // global data projection, see https://vuelayers.github.io/#/quickstart?id=global-data-projection
    dataProjection: 'EPSG:4326',
})

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')





