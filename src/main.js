// import './assets/main.css'
//引入模板的全局的样式
import '@/styles/index.scss'
//引入自定义插件对象:注册整个项目全局组件
import gloalComponent from '@/components'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配置element-plus国际化
//@ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const app = createApp(App)

//安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn //element-plus国际化配置
})
app.use(createPinia())
app.use(router)

//安装自定义插件
app.use(gloalComponent)

import './permisstion'

app.mount('#app')
