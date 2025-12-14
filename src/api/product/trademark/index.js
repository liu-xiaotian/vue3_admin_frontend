import request from '@/utils/request'

//品牌管理模块接口地址
const API = {
  //获取已有品牌接口
  TRADEMARK_URL: '/admin/product/baseTrademark/',
  //添加品牌
  ADDTRADEMARK_URL: '/admin/product/baseTrademark/save',
  //修改已有品牌
  UPDATETRADEMARK_URL: '/admin/product/baseTrademark/update',
  //删除已有品牌
  DELETE_URL: '/admin/product/baseTrademark/remove/'
}

export const reqHasTrademark = (page, limit) => {
  return request.get(API.TRADEMARK_URL + `${page}/${limit}`)
}

// 添加与修改已有品牌接口
export const reqAddOrUpdateTrademark = (data) => {
  // 修改已有品牌的数据
  if (data.id) {
    return request.put(API.UPDATETRADEMARK_URL, data)
  } else {
    //新增品牌
    return request.post(API.ADDTRADEMARK_URL, data)
  }
}

export const reqDeleteTrademark = (id) => {
  return request.delete(API.DELETE_URL + id)
}
