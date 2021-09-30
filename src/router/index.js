// Init Vue Router
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes'; // Get site routes
import { BASE_URL } from '@/variables';

Vue.use(VueRouter);

export default new VueRouter({
	routes,
	mode: 'history',
	linkActiveClass: 'active',
	transitionOnLoad: true,
	root: BASE_URL,
	scrollBehavior(to) {
		// Scroll to has if in URL
		return to.hash ? to.hash : { x: 0, y: 0 };
	},
});
