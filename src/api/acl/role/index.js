//角色管理模块的的接口
import request from '@/utils/request'
const API = {
  //获取全部的职位接口
  ALLROLE_URL: '/admin/acl/role/',
  //新增岗位的接口地址
  ADDROLE_URL: '/admin/acl/role/save',
  //更新已有的职位
  UPDATEROLE_URL: '/admin/acl/role/update',
  //获取全部的菜单与按钮的数据
  ALLPERMISSTION: '/admin/acl/permission/toAssign/',
  //给相应的职位分配权限
  SETPERMISTION_URL: '/admin/acl/permission/doAssign/?',
  //删除已有的职位
  REMOVEROLE_URL: '/admin/acl/role/remove/'
}
//获取全部的角色
export const reqAllRoleList = (page, limit, roleName) => {
  return request.get(API.ADDROLE_URL + `${page}/${limit}?roleName=${roleName}`)
}
