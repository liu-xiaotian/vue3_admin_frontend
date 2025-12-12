import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user/index'
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'

const useUserStore = defineStore('User', {
  state: () => {
    return {
      token: localStorage.getItem('TOKEN')
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
