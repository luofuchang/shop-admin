<template>
    <div class="f-menu" :style="{width:$store.state.asideWidth}">
        <el-menu default-active="2" 
        class="border-0" 
        @select="handleSelect"
        :collapse="isCollapse"
        :collapse-transition="false"
        unique-opened
        :defaultActive="defaultActive"
        >
            <template v-for="(item, index) in asideMenu" :key="index">
                <!-- 二级菜单 -->
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <template #title>
                        <el-icon><component :is="item.icon"></component></el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <!-- 二级菜单里面的子菜单 -->
                    <el-menu-item v-for="(item2, index2) in item.child" :index="item2.frontpath">
                        <el-icon><component :is="item2.icon"></component></el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <!-- 一级菜单 -->
                <el-menu-item v-else :index="item.frontpath">
                    <el-icon><component :is="item.icon"></component></el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute()
const store = useStore()
const router = useRouter()

// 监听路由变化
onBeforeRouteUpdate((to, from) => {
    defaultActive.value = to.path
})
const isCollapse = computed(() => !(store.state.asideWidth == '250px'))
// 默认选中
const defaultActive = ref(route.path)

const asideMenu = computed(() => store.state.menus)

const handleSelect = (path) => router.push(path)

</script>

<style scoped>
.f-menu {
    transition: all 0.3s;
    top: 64px;
    left: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    @apply shadow-md fixed bg-light-50;
}
.f-menu::-webkit-scrollbar{
    width: 0;
}
</style>