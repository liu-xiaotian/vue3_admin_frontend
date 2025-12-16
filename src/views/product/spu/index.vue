<template>
  <Category :scene="scene"></Category>
  <el-card style="margin: 10px 0">
    <div v-show="scene == 0">
      <el-button
        :disabled="categoryStore.c3Id ? false : true"
        type="primary"
        size="default"
        icon="Plus"
        >添加SPU</el-button
      >
      <el-table border style="margin: 10px 0px">
        <el-table-column lable="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column
          label="SPU描述"
          prop="descripution"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="SPU操作">
          <template #default="{}">
            <el-button type="primary" size="small" icon="Plus" title="添加SKU"></el-button>
            <el-button type="primary" size="small" icon="Edit" title="修改SPU"></el-button>
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
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[100, 200, 300, 400]"
        :size="size"
        :disabled="disabled"
        :background="true"
        layout="prev, pager, next, jumper,->, sizes, total"
        :total="400"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import Category from '@/components/Category/index.vue'
import useCategoryStore from '@/stores/modules/category'
const scene = ref(0)
const categoryStore = useCategoryStore()
</script>

<style lang="scss" scoped></style>
