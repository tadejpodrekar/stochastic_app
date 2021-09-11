import Vue from 'vue'
import Router from 'vue-router'
import entry from '../components/Entry.vue'
import upload from '../components/Upload.vue'
import contribute from '../components/Contribute.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{ path: '/', name:'Entry', component: entry },
		{ path: '/upload', name:'Upload', component: upload},
		{ path: '/contribute', name:'Contribute', component: contribute}
	]
})