<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button type="primary" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button @click="addUser" type="primary" size="default">添加用户</el-button>
    <el-button
      @click="deleteSelectUser"
      :disabled="selectIdArr.length ? false : true"
      type="primary"
      size="default"
      >批量删除</el-button
    >
    <el-table @selection-change="selectChange" :data="userArr" style="margin: 10px 0" border>
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)"
            >分配角色</el-button
          >
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`你确定要删除${row.username}?`"
            width="260px"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
  <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
  <el-drawer v-model="drawer">
    <!-- 头部标题:将来文字内容应该动态的 -->
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 身体部分 -->
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            @change="handleCheckAllChange"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            >全选</el-checkbox
          >
          <!-- 显示职位的的复选框 -->
          <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{
              role.roleName
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser
} from '@/api/acl/user/index'
//默认页码
let pageNo = ref(1)
//一页展示几条数据
let pageSize = ref(5)
//用户总个数
let total = ref(0)
//存储全部用户的数组
let userArr = ref([])
//定义响应式数据:收集用户输入进来的关键字
let keyword = ref('')
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref(false)
//收集用户信息的响应式数据
let userParams = reactive({
  username: '',
  name: '',
  password: ''
})
let formRef = ref()
let drawer1 = ref(false)
//存储全部职位的数据
let allRole = ref([])
//当前用户已有的职位
let userRole = ref([])

//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager
  let result = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
//组件挂载完毕
onMounted(() => {
  getHasUser()
})

//添加用户按钮的回调
const addUser = () => {
  //抽屉显示出来
  drawer.value = true
  //清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
const cancel = () => {
  drawer.value = false
}
//保存按钮的回调
const save = async () => {
  //点击保存按钮的时候,务必需要保证表单全部复合条件在去发请求
  await formRef.value.validate()
  let res = await reqAddOrUpdateUser(userParams)
  //添加或者更新成功
  if (res.code == 200) {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功' })
    //获取最新的全部账号的信息
    // getHasUser(userParams.id ? pageNo.value : 1);
    //浏览器自动刷新一次
    window.location.reload()
  } else {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' })
  }
}
//校验用户名字回调函数
const validatorUsername = (rule, value, callBack) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
//校验用户名字回调函数
const validatorname = (rule, value, callBack) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 3) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少三位'))
  }
}
const validatorPassword = (rule, value, callBack) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
//表单校验规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}

const updateUser = (row) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

const setRole = async (row) => {
  Object.assign(userParams, row)
  let res = await reqAllRole(userParams.id)
  if (res.code == 200) {
    allRole.value = res.data.allRolesList
    userRole.value = res.data.assignRoles
    drawer1.value = true
  }
}

//收集顶部复选框全选数据
const checkAll = ref(false)
//控制顶部全选复选框不确定的样式
const isIndeterminate = ref(true)
//顶部的全部复选框的change事件
const handleCheckAllChange = (val) => {
  //val:true(全选)|false(没有全选)
  userRole.value = val ? allRole.value : []
  //不确定的样式(确定样式)
  isIndeterminate.value = false
}
//顶部全部的复选框的change事件
const handleCheckedCitiesChange = (value) => {
  //顶部复选框的勾选数据
  //代表:勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
  checkAll.value = value.length === allRole.value.length
  //不确定的样式
  isIndeterminate.value = value.length !== allRole.value.length
}
//确定按钮的回调(分配职位)
const confirmClick = async () => {
  let data = {
    userId: userParams.id,
    roleIdList: userRole.value.map((item) => {
      return item.id
    })
  }
  let res = await reqSetUserRole(data)
  if (res.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    //关闭抽屉
    drawer1.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}

//删除某个用户
const deleteUser = async (userId) => {
  let res = await reqRemoveUser(userId)
  if (res.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
//准备一个数组存储批量删除的用户的ID
let selectIdArr = ref([])
//table 复选框勾选的时候会触发的事件
const selectChange = (value) => {
  selectIdArr.value = value
}
const deleteSelectUser = async () => {
  let idsList = selectIdArr.value.map((item) => {
    return item.id
  })
  let res = await reqSelectUser(idsList)
  if (res.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
