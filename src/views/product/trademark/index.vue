<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
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
            <el-button type="primary" size="small" icon="Edit"></el-button>
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
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark/index'
let trademarkArr = ref([])
let pageNo = ref(0)
let limit = ref(3)
let total = ref(0)

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
  getHasTrademark()
}
onMounted(() => getHasTrademark())
</script>

<style lang="scss" scoped></style>
