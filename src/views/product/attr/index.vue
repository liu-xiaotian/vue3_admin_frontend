<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category />
    <el-card>
      <div>
        <el-button type="primary" size="default" icon="Plus">添加属性</el-button>
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
            <el-button type="primary" size="small" icon="Edit"></el-button>
            <el-popconfirm>
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" icon="Plus">添加属性值</el-button>
        <el-button type="primary" size="default">取消</el-button>
        <el-table border style="margin: 10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row }">
              <el-input size="small" placeholder="请你输入属性值名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作" width="120px">
            <template #default="{ row }">
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default">保存</el-button>
        <el-button type="primary" size="default">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import useCategoryStore from '@/stores/modules/category'
import { reqAttr } from '@/api/product/attr'
let categoryStore = useCategoryStore()
let attrArr = ref([])
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
</script>

<style lang="scss" scoped></style>
