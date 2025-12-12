import axios from 'axios'
import useUserStore from '@/stores/modules/user'

//创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

//请求拦截器
service.interceptors.request.use(
  (config) => {
    let userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    console.error('请求拦截器错误', error)
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const status = error.response?.status
    switch (status) {
      case 400:
        console.error('请求参数错误')
        break
      case 401:
        console.error('未授权或者token过期')
        break
      case 403:
        console.error('没有权限')
        break
      case 404:
        console.error('接口不存在')
        break
      case 500:
        console.error('服务器内部错误')
        break
    }

    return Promise.reject(error)
  }
)

export default service
