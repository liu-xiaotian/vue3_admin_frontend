<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { getTime } from '@/utils/time'
const $router = useRouter()
const userStore = useUserStore()
let loginForm = reactive({ username: 'admin', password: '111111' })
const loading = ref(false)
// 获取el-form组件
const loginForms = ref()
const login = async () => {
  // 保证全部表单相校验通过再发请求
  await loginForms.value.validate()
  try {
    loading.value = true
    await userStore.userLogin(loginForm)
    $router.push('/')
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `(｡･∀･)ﾉﾞ嗨，${getTime()}好`
    })
    loading.value = false
  } catch (error) {
    ElNotification({
      type: 'error',
      message: error.message
    })
    loading.value = false
  }
}

// 自定义校验规则
const validatorUserName = (rule, value, callback) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
const validatorPassword = (rule, value, callback) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}

const rules = {
  username: [{ trigger: 'change', validator: validatorUserName }],
  password: [{ trigger: 'change', validator: validatorPassword }]
}
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}
.login_form {
  position: relative;
  top: 30vh;
  width: 80%;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;
}

h1 {
  color: white;
  font-size: 40px;
}

h2 {
  font-size: 20px;
  color: white;
  margin: 20px 0;
}
.login_btn {
  width: 100%;
}
</style>
