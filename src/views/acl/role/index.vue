<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search"
          >搜索</el-button
        >
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建世间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- row:已有的职位对象 -->
        <template #default="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)"
            >分配权限</el-button
          >
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`你确定要删除${row.roleName}?`"
            width="260px"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 添加职位与更新已有职位的结构:对话框 -->
  <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisite = false">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import useLayOutSettingStore from '@/stores/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqAllRoleList } from '@/api/acl/role'
import { reqAddOrUpdateRole } from '@/api/acl/role'
const settingStore = useLayOutSettingStore()
//当前页码
let pageNo = ref(1)
//一页展示几条数据
let pageSize = ref(10)
//搜索职位关键字
let keyword = ref('')
//存储全部已有的职位
let allRole = ref([])
//职位总个数
let total = ref(0)
//控制添加dialog显示
let dialogVisite = ref(false)
//收集新增岗位数据
let RoleParams = reactive({
  roleName: ''
})
//获取form实例
let form = ref()
//获取全部用户信息的方法
const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let res = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (res.code == 200) {
    total.value = res.data.total
    allRole.value = res.data.records
  }
}
//组件挂载完毕
onMounted(() => {
  //获取职位请求
  getHasRole()
})
//下拉菜单的回调
const sizeChange = () => {
  getHasRole()
}
//搜索按钮的回调
const search = () => {
  //再次发请求根据关键字
  getHasRole()
  keyword.value = ''
}
//重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

//添加
const addRole = () => {
  ;((dialogVisite.value = true),
    // 清空数据
    Object.assign(RoleParams, {
      roleName: '',
      id: 0
    }))
  // 清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const validatorRoleName = (rule, value, callback) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('职位名称至少两个字符'))
  }
}
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }]
}

const save = async () => {
  await form.value.validate()
  let res = await reqAddOrUpdateRole(RoleParams)

  if (res.code == 200) {
    ElMessage({ type: 'success', message: RoleParams.id ? '更新成功' : '添加成功' })
    dialogVisite.value = false
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}

//编辑职位，更新已有
const updateRole = (row) => {
  dialogVisite.value = true
  Object.assign(RoleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
