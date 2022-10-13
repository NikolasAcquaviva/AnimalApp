import { createApp } from 'vue'
import App from './components/App.vue'
import AppGame from './components/Game.vue'
import AppMenu from './components/Menu.vue'
import AppSanitary from './components/Sanitary.vue'
import AppCuriosity from './components/Curiosity.vue'
import AppVideos from './components/Video.vue'
import * as VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'mdb-vue-ui-kit/css/mdb.min.css';

const app = createApp(App)

const routes = [
    { path: '/', component: AppMenu},
    { path: '/videos', component: AppVideos},
    { path: '/sanitary', component: AppSanitary },
    { path: '/curiosity', component: AppCuriosity },
    { path: '/game', component: AppGame }
]
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
    }
)

axios.defaults.baseURL = "https://site212223.tw.cs.unibo.it"
axios.defaults.headers = {
    'Content-Type': 'application/json'
}
app.use(VueAxios,axios)
app.use(router)

//get logged username

let pair = localStorage.getItem('logged');
if(pair){
    let user = pair.split(' ')[0];
    let admin = pair.split(' ')[1];
    app.config.globalProperties.$user = user;
    app.config.globalProperties.$admin = admin;
	
}
export default {
    app
}
app.mount('#app')
