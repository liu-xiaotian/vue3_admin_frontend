<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark"
        >添加品牌</el-button
      >
      <el-table :data="trademarkArr" style="margin: 10px 0" border>
        <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
        <el-table-column prop="tmName" label="品牌名称"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #default="{ row }">
            <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm :title="`您确定要删除${row}`" width="250px" icon="Delete">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :pager-count="9"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes,total"
        :total="total"
      />
    </el-card>
    <!-- 添加和修改品牌对话框 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              alt=""
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark } from '@/api/product/trademark/index'
// el-upload 上传 http 请求头，携带 Token
// 引入用户相关的仓库
import useUserStore from '@/stores/modules/user'
import { ElMessage } from 'element-plus'
// 获取用户相关的小仓库：获取仓库内部token，登录成功以后携带给服务器
const userStore = useUserStore()
const headers = { Token: userStore.token }

let trademarkArr = ref([])
let pageNo = ref(0)
let limit = ref(3)
let total = ref(0)
let dialogFormVisible = ref(false)
// 新增品牌数据
let trademarkParams = reactive({
  tmName: '',
  logoUrl: ''
})
const formRef = ref()
const getHasTrademark = async (page = 1) => {
  pageNo.value = page
  const res = await reqHasTrademark(pageNo.value, limit.value)
  if (res.code == 200) {
    //存储已有品牌总个数
    total.value = res.data.total
    trademarkArr.value = res.data.records
  }
}

const sizeChange = () => {
  //当前每一页的数据量发生变化的时候，当前页码归1
  // 当一页显示几条数据发生改变的时候
  getHasTrademark()
}
onMounted(() => getHasTrademark())

// 新增和修改弹框
const addTrademark = () => {
  dialogFormVisible.value = true
  // 清空收集数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  nextTick(() => {
    formRef.value.clearValidate('TmName')
    formRef.value.clearValidate('logoUrl')
  })
}
const cancel = () => {
  dialogFormVisible.value = false
}

// 自定义校验规则
const validatorTmName = (rule, value, callBack) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于登录两位'))
  }
}
const validatorLogoUrl = (rule, value, callBack) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('logo图片务必上传'))
  }
}

// 表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }]
}

// 文件上传之前
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF'
    })
    return false
  }
}
const handleAvatarSuccess = (response, uploadFile) => {
  trademarkParams.logoUrl = response.data
}

// 上传
const confirm = async () => {
  await formRef.value.validate()
  let res = await reqAddOrUpdateTrademark(trademarkParams)
  if (res.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
    })
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
    })
    dialogFormVisible.value = false
  }
}

// 修改品牌
const updateTrademark = (row) => {
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  Object.assign(trademarkParams, row)
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
