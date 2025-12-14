import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
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
        SET_TOKEN(res.data)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data))
      }
    },
    //获取用户信息的方法
    async userInfo() {
      let res = await reqUserInfo()
      if (res.code == 200) {
        this.username = res.data.username
        this.avatar = res.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    //退出登录
    async userLogout() {
      const result = await reqLogout()
      if (result.code == 200) {
        REMOVE_TOKEN()
        this.token = ''
        this.username = ''
        this.avatar = ''
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    }
  },
  getters: {}
})

export default useUserStore
