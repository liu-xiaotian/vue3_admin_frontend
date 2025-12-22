import request from '@/utils/request'

const API = {
  //获取全部菜单与按钮的标识数据
  ALLPERMISSTION_URL: '/admin/acl/permission',
  //给某一级菜单新增一个子菜单
  ADDMENU_URL: '/admin/acl/permission/save',
  //更新某一个已有的菜单
  UPDATE_URL: '/admin/acl/permission/update',
  //删除已有的菜单
  DELETEMENU_URL: '/admin/acl/permission/remove/'
}

// 获取菜单数据
export const reqAllPermisstion = () => {
  return request.get(API.ALLPERMISSTION_URL)
}
