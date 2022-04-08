import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Api from "./utils/Api";


Vue.config.productionTip = false

/**
 *
 * @type {Manager}
 */
window.$manager=new Manager();
Vue.prototype.$manager = Vue.observable(window.$manager);


let apiUrl="https://02.recap.tw/im.api/api";
apiUrl="https://recap.tw/im.api/api"
/**
 *
 * @type {Api}
 */
window.$api=new Api(apiUrl);
Vue.prototype.$api = Vue.observable(window.$api);

/**
 *
 * @type {Db}
 */
window.$db=new Db();
Vue.prototype.$db = Vue.observable(window.$db);

/**
 *
 * @type {Utils}
 */
window.$utils=new Utils();
Vue.prototype.$utils = Vue.observable(window.$utils);


import Db from "@/Db";
import Utils from "@/utils/Utils";
import Manager from "@/Manager";

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')





