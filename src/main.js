// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import CONFIG from "./CONFIG.json";
import router from "./router";
import moment from 'moment';
import underscore from "vue-underscore";
import vueHeadful from 'vue-headful';
import vueTopprogress from 'vue-top-progress'

Vue.component('vue-headful', vueHeadful)
Vue.use(underscore);
Vue.use(vueTopprogress, {
	color: "rgba(236, 88, 0, 1)"
})
Vue.config.productionTip = false;


Object.defineProperty(Vue.prototype, '$CONFIG', {
	value: CONFIG
})

Object.defineProperty(Vue.prototype, '$WARDS', {
	value: require('../static/WARDSPRECINCTS.json')
})

Vue.config.ignoredElements = [/^ion-/]


/* eslint-disable no-new */
new Vue({
	el: "#app",
	router,
	template: "<App/>",
	components: {
		App
	}
});