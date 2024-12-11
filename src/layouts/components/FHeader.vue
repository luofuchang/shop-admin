<template>
    <div class="f-header">
        <!--主词-->
        <span class="logo">
            <!--主图标-->
            <el-icon class="mr-2">
                <ChromeFilled />
            </el-icon>
            Vue 后台开发</span>
        <el-tooltip effect="dark" content="折叠" placement="bottom">
            <!--折叠图标-->
            <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
                <Fold v-if="$store.state.asideWidth == '250px'"/>
                <Expand v-else/>
            </el-icon>
        </el-tooltip>
        <!--刷新图标-->
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="reload">
                <Refresh />
            </el-icon>
        </el-tooltip>
        <!--右边部分-->
        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <!--全屏按钮-->
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>
            <!--下拉菜单-->
            <el-dropdown class="dropdown" @command="handlecommand">
                <span class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <FormDrawer ref="formDrawerRef" @submit="onSubmit" title='修改密码' destory-on-close>
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" show-password></el-input>
            </el-form-item>
        </el-form>
    </FormDrawer>

</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { logout, resetpassword } from '~/api/manager';
import { myMessageBox, myNotification } from '~/composables/util'
import { useFullscreen } from '@vueuse/core'
import FormDrawer from '~/components/FormDrawer.vue';

const { isFullscreen, toggle } = useFullscreen()
const formDrawerRef = ref(null)
const router = useRouter()
const store = useStore()
const formRef = ref(null)
// 表单
const form = reactive({
    oldpassword: '',
    password: '',
    repassword: ''
})


// 验证规则
const rules = {
    oldpassword: [
        {
            required: true,
            message: 'oldpassword should not be empty',
            trigger: 'blur',
        }
    ],
    password: [
        {
            required: true,
            message: 'password should not be empty',
            trigger: 'blur',
        }
    ],
    repassword: [
        {
            required: true,
            message: 'repassword should not be empty',
            trigger: 'blur',
        }
    ]
}
//修改密码提交方法
const onSubmit = () => {
    formRef.value.validate((valid) => {
        // 参数校验
        if (!valid) {
            return false
        }
        formDrawerRef.value.showLoading()
        // 等待动画
        resetpassword(form).then(
            res => {
                myNotification("修改密码成功，请重新登录")
                store.dispatch("logout")
                router.push("/login")
            }
        )
        .finally(()=>formDrawerRef.value.hideLoading())
    })
}
//页面重载
const reload = () => location.reload()
//下拉菜单回调事件触发
const handlecommand = (command) => {
    switch (command) {
        case "editPassword":
            // showDrawer.value = true
            formDrawerRef.value.open()
            break;
        case "logout":
            handlelogout();
            break;
    }
}
//处理登出
function handlelogout() {

    // 弹出确认框
    myMessageBox("要退出登录吗？").then(res => {
        console.log("已退出");
        // 发送登出请求
        logout().finally(res => {
            // 删除 cookie中的token
            // 清楚 state 的状态
            store.dispatch("logout")

            // 跳转到 登录页
            router.push("/login")
            // 提示退出成功
            // console.log(res);
            myMessageBox("退出成功")
        })
    })
}

</script>

<style>
.f-header {
    z-index: 1000;
    @apply flex bg-indigo-700 text-light-50 fixed top-0 left-0 right-0 items-center;
    height: 64px;
}

.logo {
    width: 250px;
    @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
    @apply flex items-center justify-center;
    height: 64px;
    width: 42px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-indigo-500;
}

.f-header .dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex items-center justify-center mx-5;
}
</style>