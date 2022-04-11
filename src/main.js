import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Api from "./utils/Api";


Vue.config.productionTip = false

/**
 *
 * @type {Utils}
 */
window.$utils=new Utils();
Vue.prototype.$utils = Vue.observable(window.$utils);

/**
 *
 * @type {Manager}
 */
window.$manager=new Manager();
Vue.prototype.$manager = Vue.observable(window.$manager);

/**
 *
 * @type {Db}
 */
window.$db=new Db(
    [
        new Api("https://recap.tw"),
        new Api("https://02.recap.tw"),
    ]
);
Vue.prototype.$db = Vue.observable(window.$db);




import Db from "@/Db";
import Utils from "@/utils/Utils";
import Manager from "@/Manager";

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')





