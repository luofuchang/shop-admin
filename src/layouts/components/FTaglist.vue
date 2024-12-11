<template>
    <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
        <el-tabs @tab-change="handleTabChange" style="min-width: 100px;" v-model="activeTab" type="card"
            class="demo-tabs" @tab-remove="removeTab">
            <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"
                :closable="item.path != '/'"></el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height: 44px;"></div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies'


const route = useRoute()
const cookie = useCookies()
const router = useRouter()
const activeTab = ref(route.path)
const tabList = ref([
    {
        title: '后台首页',
        path: "/"
    }
])

// 下拉菜单事件
const handleCommand = (command) => {
    switch (command) {
        case "clearOther":
            tabList.value = tabList.value.filter( t => t.path == '/' || t.path == activeTab.value)         
            cookie.set("tabList", tabList.value)
            router.push(activeTab.value)               
            break;
        case "clearAll":
            activeTab.value = '/'
            tabList.value = tabList.value.filter( t => t.path == '/')
            cookie.set("tabList", tabList.value)
            router.push('/')     
            break;
    }
}



// 初始化一个标签导航栏的列表
function initTabList() {
    let tabs = cookie.get("tabList")
    if (tabs) {
        tabList.value = tabs
    }
}

initTabList()


// 通过点击 tag 切换到对应的页面
const handleTabChange = (tab) => {
    activeTab.value = tab.path
    router.push(tab)
}

// 添加标签路由（addTabByRoute）
function addTagByRoute(tab) {
    let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
    if (noTab) {
        tabList.value.push(tab)
    }
    // 添加到 cookie中去
    cookie.set("tabList", tabList.value)
}

// menu组件点击后在taglist组件显示（通讯）
onBeforeRouteUpdate((to, from) => {
    // 让当前tag处于激活状态
    activeTab.value = to.path
    addTagByRoute({
        title: to.meta.title,
        path: to.path
    })
})

// 关闭标签页
const removeTab = (tab) => {

    let tabs = tabList.value
    let a = activeTab.value

    if (a == tab) {
        tabs.forEach((t, index) => {
            if (t.path == tab) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if(nextTab){
                    a = nextTab.path
                    router.push(a)
                }
            }
        })
    }
    activeTab.value = a
    tabList.value = tabList.value.filter( t => t.path != tab)
    cookie.set("tabList", tabList.value)
}

</script>

<style scoped>
.f-tag-list {
    top: 64px;
    right: 0;
    height: 44px;
    z-index: 100;
    @apply fixed bg-gray-100 flex items-center px-2;
}

.tag-btn {
    height: 32px;
    @apply bg-white flex items-center justify-center rounded ml-auto px-2;
}

:deep(.el-tabs__header) {
    border: 0 !important;
    @apply mb-0;
}

:deep(.el-tabs__nav) {
    border: 0 !important;
}

:deep(.el-tabs__item) {
    border: 0 !important;
    height: 32px;
    line-height: 32px;
    @apply bg-white mx-1 rounded;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
    height: 32px;
    line-height: 32px;
}

:deep(.is-disabled) {
    cursor: not-allowed;
    @apply text-gray-300;
}
</style>