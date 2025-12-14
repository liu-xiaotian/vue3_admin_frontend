<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
      <el-table style="margin: 10px 0" border>
        <el-table-column label="序号"></el-table-column>
        <el-table-column label="品牌名称"></el-table-column>
        <el-table-column label="品牌LOGO"></el-table-column>
        <el-table-column label="品牌操作"></el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes,total"
        :total="total"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
let pageNo = ref(1)
let limit = ref(3)
let total = ref(60)
</script>

<style lang="scss" scoped></style>
