// import './assets/main.css'
//引入模板的全局的样式
import '@/styles/index.scss'
//引入自定义插件对象:注册整个项目全局组件
import gloalComponent from '@/components'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

//安装自定义插件
app.use(gloalComponent)

app.mount('#app')
