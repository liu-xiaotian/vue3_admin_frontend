//用户管理模块的接口
import request from '@/utils/request'

const API = {
  //获取全部已有用户账号信息
  ALLUSER_URL: '/admin/acl/user/',
  //添加一个新的用户账号
  ADDUSER_URL: '/admin/acl/user/save',
  //更新已有的用户账号
  UPDATEUSER_URL: '/admin/acl/user/update',
  //获取全部职位,当前账号拥有的职位接口
  ALLROLEURL: '/admin/acl/user/toAssign/',
  //给已有的用户分配角色接口
  SETROLE_URL: '/admin/acl/user/doAssignRole',
  //删除某一个账号
  DELETEUSER_URL: '/admin/acl/user/remove/',
  //批量删除的接口
  DELETEALLUSER_URL: '/admin/acl/user/batchRemove'
}

// 获取用户账号信息的接口
export const reqUserInfo = (page, limit, username) =>
  request.get(API.ALLUSER_URL + `${page}/${limit}?username=${username}`)

export const reqAddOrUpdateUser = (data) => request.post(API.ADDUSER_URL, data)
