import Vue from 'vue'
import App from './App.vue'

import router from "@/router";

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import SvgIcon from "@/components/svgIcon";
import "./assets/icons";

Vue.config.productionTip = false

Vue.use(ElementUI).component("svg-icon", SvgIcon);

new Vue({
    router, render: h => h(App),
}).$mount('#app')
