import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user/index'
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
import { constantRoute } from '@/router/router'

const useUserStore = defineStore('User', {
  state: () => {
    return {
      token: localStorage.getItem('TOKEN'),
      menuRoutes: constantRoute, //仓库存储生成菜单需要数组(路由)
      avatar: '',
      username: '123'
    }
  },
  actions: {
    // 用户登录的方法
    async userLogin(data) {
      const res = await reqLogin(data)
      if (res.code == 200) {
        this.token = res.data
        SET_TOKEN(res.data.token)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data))
      }
    }
  },
  getters: {}
})

export default useUserStore
