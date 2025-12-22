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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { reqAllPermisstion } from '@/api/acl/permission'
let PermisstionArr = ref([])
onMounted(() => {
  getHasPermisstion()
})
const getHasPermisstion = async () => {
  let res = await reqAllPermisstion()
  if (res.code == 200) {
    PermisstionArr.value = res.data
  }
}
</script>

<style lang="scss" scoped></style>
