<template>
  <el-button size="small" circle icon="Refresh" @click="updateRefsh"></el-button>
  <el-button size="small" circle icon="fullScreen" @click="fullScreen"></el-button>

  <el-popover placement="bottom" title="主题设置" :width="300" trigger="click">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="setColor"
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import useUserStore from '@/stores/modules/user'
import useLayOutSettingStore from '@/stores/modules/setting'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
let $router = useRouter()
let $route = useRoute()
const updateRefsh = () => {
  LayOutSettingStore.refsh = !LayOutSettingStore.refsh
}

// 全屏模式切换
const fullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 退出登录
const logout = async () => {
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

//颜色组件组件的数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])

//暗黑模式切换
//收集开关的数据
let dark = ref(false)
const changeDark = () => {
  let html = document.documentElement
  dark.value ? (html.className = 'dark') : (html.className = '')
}
const setColor = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style lang="scss" scoped></style>
