<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="logo" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup>
import setting from '@/setting'
</script>

<script>
// 使用 v2 写法导出项目名
export default {
  name: 'Logo'
}
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>
