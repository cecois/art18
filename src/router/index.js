import Vue from "vue";
import Router from "vue-router";
import A18 from "@/components/A18";
Vue.use(Router);
export default new Router({
	routes: [
	// {
	// 	path: "/trace",
	// 	name: "EBLTracer",
	// 	component: EBLT
	// }, 
		{
			path: "/:schema?/:precinct?/:basemap?/:splayed?/:bbox?",
			name: "A18",
			component: A18
	}]
});