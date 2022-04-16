import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPuls from 'element-plus'
import 'element-plus/dist/index.css'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import store from './store'

console.log("环境变量：", import.meta.env)
const app = createApp(App);


// app 挂载对象
app.config.globalProperties.$request = request;
app.config.globalProperties.$api = api;
app.config.globalProperties.$storage = storage;
app.use(router).use(store).use(ElementPuls).mount('#app')
