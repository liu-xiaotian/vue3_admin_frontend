<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          @click="addAttr"
          :disabled="categoryStore.c3Id ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          >添加属性</el-button
        >
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row }">
              <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin: 5px">{{
                item.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.attrName}`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input v-model="attrParams.attrName" placeholder="请输入属性名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          >添加属性值</el-button
        >
        <el-button @click="cancel" type="primary" size="default">取消</el-button>
        <el-table border style="margin: 10px 0" :data="attrParams.attrValueList">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row, $index }">
              <el-input
                @blur="toLook(row, $index)"
                :ref="(vc) => (inputArr[$index] = vc)"
                v-if="row.flag"
                v-model="row.valueName"
                size="small"
                placeholder="请你输入属性值名称"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作" width="120px">
            <template #default="{ index }">
              <el-button
                @click="attrParams.attrValueList.splice(index, 1)"
                type="primary"
                size="small"
                icon="Delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          @click="save"
          type="primary"
          size="default"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
          >保存</el-button
        >
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/stores/modules/category'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
let categoryStore = useCategoryStore()
let attrArr = ref([])
//定义card组件内容切换变量
let scene = ref(0)
// 收集新增属性
let attrParams = reactive({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3
})
//准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref([])
watch(
  () => categoryStore.c3Id,
  () => {
    attrArr.value = []
    if (!categoryStore.c3Id) return
    getAttr()
  }
)
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let res = await reqAttr(c1Id, c2Id, c3Id)
  if (res.code == 200) {
    attrArr.value = res.data
  }
}

// 控制添加属性面板
const addAttr = () => {
  //每一次点击的时候,先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3
  })
  scene.value = 1
}
//取消按钮的回调
const cancel = () => {
  scene.value = 0
  getAttr()
}
// 修改属性
const updateAttr = (row) => {
  scene.value = 1
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 添加属性值按钮的回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true
  })
  nextTick(() => inputArr.value[attrParams.attrValueList.length - 1].focus())
}
// 保存
const save = async () => {
  let res = await reqAddOrUpdateAttr(attrParams)
  if (res.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }
}
// 表单属性值失去焦点时的回调
const toLook = (row, $index) => {
  if (row.valueName.trim() == '') {
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }
  row.flag = false
}
// 属性值div点击可以编辑事件
const toEdit = (row, $index) => {
  row.flag = true
  nextTick(() => [inputArr.value[$index].focus()])
}

// 删除属性
const deleteAttr = async (row) => {
  const res = await reqRemoveAttr(row)
  //删除成功
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    //获取一次已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

onBeforeUnmount(() => {
  // 清空仓库的数据
  categoryStore.$reset()
})
</script>

<style lang="scss" scoped></style>
