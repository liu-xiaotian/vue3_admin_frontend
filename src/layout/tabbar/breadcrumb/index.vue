<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="vertical-align: -20%">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { useRoute } from 'vue-router'
import useLayOutSettingStore from '@/stores/modules/setting'
//获取路由对象
let $route = useRoute()
let LayOutSettingStore = useLayOutSettingStore()

const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>
<script>
export default {
  name: 'Breadcrumb'
}
</script>

<style lang="scss" scoped></style>
