//统一管理 用户相关接口
import request from '@/utils/request'

// 项目用户相关的请求地址
const API = {
  LOGIN_URL: '/api/user/login',
  USERINFO_URL: '/dev-api/api/user/info',
  LOGOUT_URL: '/admin/acl/index/logout'
}

//登录接口方法
export const reqLogin = (data) => {
  return request.post(API.LOGIN_URL, data)
}

// 获取用户信息接口方法
export const reqUserInfo = () => {
  return request.get(API.USERINFO_URL)
}

/**
 * @description 退出登录接口
 */
export const reqLogout = () => request.post(API.LOGOUT_URL)
