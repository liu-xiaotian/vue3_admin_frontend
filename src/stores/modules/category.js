import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/index'

const useCategoryStore = defineStore('Category', {
  state: () => {
    return {
      //存储分类的数据
      c1Arr: [],
      c2Arr: [],
      c3Arr: [],
      //存储分类下对应的id
      c1Id: '',
      c2Id: '',
      c3Id: ''
    }
  },
  actions: {
    async getC1() {
      const res = await reqC1()
      if (res.code == 200) {
        this.c1Arr = res.data
      }
    },
    async getC2() {
      const res = await reqC2(this.c1Id)
      if (res.code == 200) {
        this.c2Arr = res.data
      }
    },
    async getC3() {
      const res = await reqC3(this.c2Id)
      if (res.code == 200) {
        this.c3Arr = res.data
      }
    }
  },
  getters: {}
})

export default useCategoryStore
