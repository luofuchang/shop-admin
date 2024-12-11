<template>
    <div>
        <el-container class="bg-white rounded" :style="{ height: calcHeight + 'px' }">
            <el-header class="image-header">
                <el-button class="px-1" type="primary" 
                 size="small" @click="handleOpenCreate">新增图片分类
                </el-button>
                <el-button class="px-1" type="primary" 
                 size="small" @click="handleUploadFile">上传图片
                </el-button>
            </el-header>
            <el-container>
                <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>
                <ImageMain ref="ImageMainRef"/>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import ImageMain from '~/components/ImageMain.vue';
import ImageAside from '~/components/ImageAside.vue';
import { ref } from 'vue';

let windowHeight = window.innerHeight || document.body.clientHeight
const calcHeight = windowHeight - 64 - 44 - 40

const ImageAsideRef = ref(null)
const ImageMainRef = ref(null)


// 打开抽屉
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const handleAsideChange = (image_class_id) => {
    ImageMainRef.value.loadData(image_class_id)
}

const handleUploadFile = () => {
    ImageMainRef.value.openUploadFile()
}

</script>

<style>
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center
}
</style>