<template>
  <el-table :data="PermisstionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button
          :disabled="row.level == 4 ? true : false"
          type="primary"
          @click="addPermisstion(row)"
          size="small"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          :disabled="row.level == 1 ? true : false"
          type="primary"
          @click="updatePermisstion(row)"
          size="small"
          >编辑</el-button
        >
        <el-popconfirm
          :title="`你确定要删除${row.name}?`"
          width="260px"
          @confirm="removeMenu(row.id)"
        >
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false"
              >删除</el-button
            >
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框组件：添加或者更新已有的菜单的数据结构 -->
  <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
    <!-- 表单组件:收集新增与已有的菜单的数据 -->
    <el-form>
      <el-form-item label="名称">
        <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { reqAddOrUpdateMenu, reqAllPermisstion, reqRemoveMenu } from '@/api/acl/permission'
let PermisstionArr = ref([])
let dialogVisible = ref(false)
let menuData = reactive({
  code: '',
  level: 0,
  name: '',
  pid: 0
})
onMounted(() => {
  getHasPermisstion()
})
const getHasPermisstion = async () => {
  let res = await reqAllPermisstion()
  if (res.code == 200) {
    PermisstionArr.value = res.data
  }
}
// 添加菜单按钮的回调
const addPermisstion = (row) => {
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0
  })
  dialogVisible.value = true
  menuData.level = row.level + 1
  menuData.pid = row.id
}
//编辑已有的菜单
const updatePermisstion = (row) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}
//确定按钮的回调
const save = async () => {
  let res = await reqAddOrUpdateMenu(menuData)
  if (res.code == 200) {
    dialogVisible.value = false
    ElMessage({ type: 'success', message: menuData.id ? '更新成功' : '添加成功' })
    getHasPermisstion()
  }
}
//删除按钮
const removeMenu = async (id) => {
  let res = await reqRemoveMenu(id)
  if (res.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasPermisstion()
  }
}
</script>

<style lang="scss" scoped></style>
