<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <breadcrumb></breadcrumb>
    </div>
    <div class="tabbar_right">
      <setting></setting>
    </div>
  </div>
</template>

<script setup>
import breadcrumb from '@/layout/tabbar/breadcrumb/index.vue'
import setting from '@/layout/tabbar/setting/index.vue'
</script>
<script>
export default {
  name: 'Tabbar'
}
</script>
<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-color: pink;

  .tabbar_left {
    display: flex;
    align-items: center;
    margin: 20px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
