<template>
    <div v-if="modelValue">
        <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover"
            class="w-[100px] h-[100px] rounded border mr-2"></el-image>
        <div v-else class="flex flex-warp">
            <div class="relative mx-1 mb-2 w-[100px] h-[100px]" v-for="(url, index) in modelValue" :key="index">
                <el-icon @click="removeImage(url)" class="absolute right-[5px] top-[5px] cursor-pointer"
                    style="z-index: 10">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover"
                    class=" bg-white rounded-full rounde w-[100px] h-[100px] rounded border mr-2"></el-image>
            </div>
        </div>
    </div>
    <div class="choose-image-btn" @click="open">
        <el-icon :size="25" class="text-gray-500">
            <Plus />
        </el-icon>
    </div>

    <el-dialog title="选择图片" v-model="dialogVisible" width="70%" top="5vh">
        <el-container class="bg-white rounded" style="height: 70vh;">
            <el-header class="image-header">
                <el-button class="px-1" type="primary" size="small" @click="handleOpenCreate">新增图片分类
                </el-button>
                <el-button class="px-1" type="primary" size="small" @click="handleUploadFile">上传图片
                </el-button>
            </el-header>
            <el-container>
                <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
                <ImageMain :limit="limit" ref="ImageMainRef" @choose="handleChoose" openChoose />
            </el-container>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref } from 'vue';
import ImageMain from '~/components/ImageMain.vue';
import ImageAside from '~/components/ImageAside.vue';
import { myNotification } from '~/composables/util';

const dialogVisible = ref(false)
const ImageAsideRef = ref(null)
const ImageMainRef = ref(null)


const open = () => dialogVisible.value = true
const close = () => dialogVisible.value = false

// 打开抽屉
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const handleAsideChange = (image_class_id) => {
    ImageMainRef.value.loadData(image_class_id)
}

const handleUploadFile = () => {
    ImageMainRef.value.openUploadFile()
}

const props = defineProps({
    modelValue: [String, Array],
    limit: {
        type: Number,
        default: 1
    }
})

const emit = defineEmits(["update:modelValue"])

let urls = []
const handleChoose = (image) => {
    urls = image.map( o => o.url)
}

const submit = () => {
    let value = []
    if (props.limit == 1) {
        
    } else {
        value = [...props.modelValue, ...urls]
        if (value.length > props.limit) {
            return myNotification("最多还能选择"+(props.limit - props.modelValue.length )+"张")
        }
    }
    if (value) {
        emit("update:modelValue", value)
    }
    close()
}

const removeImage = (url) => emit("update:modelValue", props.modelValue.filter(u => u != url))

</script>

<style>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex items-center justify-center cursor-pointer hover:(bg-gray-100);
}
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center
}
</style>w