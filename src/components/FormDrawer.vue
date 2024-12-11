<template>
    <el-drawer v-model="showDrawer" :size="size" :title="title" :destroy-on-close="destoryOnClose">
        <div class="formDrawer">
            <!-- 表单部分 -->
            <div class="body">
                <!-- 插槽 -->
                <slot></slot>
            </div>
            <!-- 按钮 -->
            <div class="actions">
                <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="info" @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>

import { ref } from 'vue';

const showDrawer = ref(false)

const loading = ref(false)

const open = () => showDrawer.value = true

const close = () => showDrawer.value = false

const showLoading = () => loading.value = true

const hideLoading = () => loading.value = false

// 接受父组件传递的属性
const props = defineProps({
    title: String,
    size: {
        type: String,
        default: "40%"
    },
    destoryOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: "提交"
    }
})

// 向父组件暴露以下方法
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})

// 向父组件传递属性 提交
const emits = defineEmits(["submit"])
const submit = () => emits("submit")


</script>

<style scoped>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDrawer .body {
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.formDrawer .actions {
    height: 50px;
    @apply mt-auto flex items-center
}
</style>