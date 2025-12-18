<template>
  <Category :scene="scene"></Category>
  <el-card style="margin: 10px 0">
    <div v-show="scene == 0">
      <el-button
        @click="addSpu"
        :disabled="categoryStore.c3Id ? false : true"
        type="primary"
        size="default"
        icon="Plus"
        >添加SPU</el-button
      >
      <el-table :data="records" border style="margin: 10px 0px">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
        <el-table-column label="SPU操作">
          <template #default="{ row }">
            <el-button
              @click="addSku(row)"
              type="primary"
              size="small"
              icon="Plus"
              title="添加SKU"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              title="修改SPU"
              @click="updateSpu(row)"
            ></el-button>
            <el-button type="primary" size="small" icon="View" title="查看SKU列表"></el-button>
            <el-popconfirm>
              <template #reference>
                <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 8]"
        :size="size"
        :disabled="disabled"
        :background="true"
        layout="prev, pager, next, jumper,->, sizes, total"
        :total="total"
        @size-change="changeSize"
        @current-change="getHasSpu"
      />
    </div>
    <spuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></spuForm>
    <skuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></skuForm>
  </el-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import Category from '@/components/Category/index.vue'
import useCategoryStore from '@/stores/modules/category'
import { reqHasSpu } from '@/api/product/spu'
import spuForm from './spuForm.vue'
import skuForm from './skuForm.vue'
const scene = ref(0)
const categoryStore = useCategoryStore()
//分页器默认页码
let pageNo = ref(1)
//每一页展示几条数据
let pageSize = ref(3)
//存储已有的SPU的数据
let records = ref([])
//存储已有SPU总个数
let total = ref(0)
// 1. 定义一个名字与模板中 ref 属性相同的变量
const spu = ref(null)
//存储已有的SPU这些数据
let AllTradeMark = ref([])
//此方法执行:可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  let res = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (res.code == 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}
watch(
  () => categoryStore.c3Id,
  () => {
    records.value = []
    if (!categoryStore.c3Id) return
    getHasSpu()
  }
)

//分页器下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu()
}

// 添加spu（显示组件）
const addSpu = () => {
  //切换为场景1:添加与修改已有SPU结构->SpuForm
  scene.value = 1
  //点击添加SPU按钮,调用子组件的方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id)
}
// 子组件spuForm绑定自定义事件
const changeScene = (obj) => {
  //子组件Spuform点击取消变为场景0:展示已有的SPU
  scene.value = obj.flag
  if (obj.params == 'update') {
    getHasSpu(pageNo.value)
  } else {
    getHasSpu()
  }
}
// 修改SPU
const updateSpu = (row) => {
  scene.value = 1
  spu.value.initHasSpuData(row)
}

const sku = ref()
//添加SKU按钮的回调
const addSku = (row) => {
  //点击添加SKU按钮切换场景为2
  scene.value = 2
  //调用子组件的方法初始化添加SKU的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
</script>

<style lang="scss" scoped></style>
