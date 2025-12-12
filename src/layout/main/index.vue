<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import useLayOutSettingStore from '@/stores/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()

let flag = ref(true)
watch(
  () => LayOutSettingStore.refsh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  }
)
</script>
<script>
export default {
  name: 'Main'
}
</script>
<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 1s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
