<template>
  <el-icon style="margin-right: 10px">
    <component :is="1 > 2 ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { useRoute } from 'vue-router'
//获取路由对象
let $route = useRoute()
</script>
<script>
export default {
  name: 'Breadcrumb'
}
</script>

<style lang="scss" scoped></style>
