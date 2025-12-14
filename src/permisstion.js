// 路由鉴权
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from '@/stores/modules/user'
import setting from './setting'

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start()
  const token = userStore.token
  const username = userStore.username
  console.log(`token:${token}`)

  if (token) {
    console.log('执行有token的逻辑')
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        try {
          const res = await userStore.userInfo()
          console.log(res)

          next({ ...to })
        } catch (error) {
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    console.log('执行没有token的逻辑')
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

router.afterEach((to, from) => {
  nprogress.done()
})
