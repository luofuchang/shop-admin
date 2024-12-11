<template>
  <el-row class="login-container">

    <el-col :lg="16" :md="12" class="left">
      <div>
        <div>欢迎光临</div>
        <div>本站点由 《Vue3实战商城后台管理系统开发视频课程》 演示</div>
      </div>
    </el-col>

    <el-col :lg="8" :md="12" class=" right flex-col">
      <h2 class="title">欢迎回来</h2>
      <div>
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
      <el-form ref="formRef" :model="form" class="w-[250px] " :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon class="el_input_icon">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password>
            <template #prefix>
              <el-icon class="el_input_icon">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[250px]" round color="#626aef" type="primary" @click="onSubmit"
            :loading="loading">登录/Login</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { myNotification } from '~/composables/util';
import { useStore } from 'vuex'

const store = useStore()
const formRef = ref(null)
const router = useRouter()
const loading = ref(false)

// do not use same name with ref
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    {
      required: true,
      message: 'username should not be empty',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 10,
      message: 'username length should be 3-10',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: 'password should not be empty',
      trigger: 'blur',
    }
  ]
}

const onSubmit = () => {

  formRef.value.validate((valid) => {
    // 参数校验
    if (!valid) {
      return false
    }
    // 等待动画
    loading.value = true

    store.dispatch("login", form).then(
      res => {
        myNotification("登录成功")
        router.push('/')
      })
      .finally(() => loading.value = false)
  })
}

// 添加键盘监听事件
function onKeyUp(e) {
  // console.log(e);
  if (e.key == "Enter") {
    onSubmit()
  }
}

// 开始键盘监听
onMounted(() => {
  document.addEventListener("keyup", onKeyUp)
})

// 结束键盘监听
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp)
})


</script>

<style scoped>
.login-container {
  @apply min-h-screen bg-indigo-500
}

.login-container .left, .login-container .right {
  @apply flex items-center justify-center
}

.left>div>div:first-child {
  @apply font-bold text-6xl text-light-50 mb-5
}

.left>div>div:last-child {
  @apply text-light-50 text-m
}

.login-container .right {
  @apply bg-light-50
}

.right .title {
  @apply font-bold text-gray-800 text-3xl
}

.right>div {
  @apply flex items-center justify-center my-5 space-x-2 text-gray-400
}

.right .line {
  @apply h-[1px] w-16 bg-gray-200
}
</style>