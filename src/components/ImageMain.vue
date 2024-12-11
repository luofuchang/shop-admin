<template>
    <el-main class="image-main">
        <div class="top p-3">
            <!-- 图片展示 -->
            <!-- <div v-for="(item, index) in list" :key="index">
                {{ item.url }}
            </div> -->
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" class="relative mb-3" :body-style="{ 'padding': 0 }" :class="{'border-blue-500': item.checked}">
                        <el-image :src="item.url" fit="cover" class="w-full h-[150px]" :preview-src-list="[item.url]"
                            :initial-index="0">
                        </el-image>
                        <div class="image-title">
                            {{ item.name }}
                        </div>
                        <div class="flex justify-center items-center p-2">
                            <el-checkbox v-if="openChoose" v-model="item.checked" @change="handleChooseChange(item)"/>
                            <el-button type="primary" size="small" text @click="handleRename(item)">重命名</el-button>
                            <el-popconfirm title="确认删除?" @confirm="handleDelete(item.id)" confirmButtomText="确认"
                                cancelButtonText="取消">
                                <template #reference>
                                    <el-button type="primary" size="small" text class="!m-0">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>

                </el-col>
            </el-row>

        </div>
        <div class="bottom">
            <!-- 分页部分 -->
            <el-pagination background layout="prev, pager, next" @current-change="getData" :total="total"
                :current-page="currentPage" :page-size="limit" />
        </div>
    </el-main>

    <el-drawer v-model="drawer" title="上传">
        <UploadFile :data="{ image_class_id }" @success="handleUploadSuccess"/>
    </el-drawer>
</template>

<script setup>
import { getImageList, renameImage, deleteImage } from '~/api/image';
import { computed, ref } from 'vue';
import { myNotification, showPrompt } from '~/composables/util';
import UploadFile from './UploadFile.vue';
import { type } from 'windicss/utils';
import { number } from 'echarts';

// 分页数据
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const loading = ref(false)
const list = ref([])
const image_class_id = ref(0)
const drawer = ref(false)

const props = defineProps({
    openChoose: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: 1
    }
})

const openUploadFile = () => drawer.value = true

function getData(p = null) {
    // 检查类型
    if (typeof p == "number") currentPage.value = p
    loading.value = true

    /**
     *  加载数据
     *  参数1：当前分类id
     *  参数2：当前页
     */
    getImageList(image_class_id.value, currentPage.value)
        .then(res => {
            total.value = res.totalCount
            list.value = res.list.map(o => {
                o.checked = false
                return o
            })
        })
        .finally(() => loading.value = false)
}

/**
 * 根据分类id重新加载图片列表
 * 把loadData暴露给父组件 list.vue
 * @param id 父组件传入的图片分类id
 */
const loadData = (id) => {
    currentPage.value = 1
    image_class_id.value = id
    getData()
}

defineExpose({
    loadData,
    openUploadFile
})

//重命名 弹出框
const handleRename = (item) => {
    showPrompt("重命名", item.name)
        .then(({ value }) => {
            loading.value = true
            renameImage(item.id, value)
                .then(res => {
                    myNotification("修改成功")
                    getData()
                })
                .finally(() => loading.value = false)
        })
}

// 删除
const handleDelete = (id) => {
    loading.value = true
    deleteImage([id])
        .then(res => {
            myNotification("删除成功")
            getData()
        })
        .finally(() => loading.value = false)
}

// 上传成功
const handleUploadSuccess = () => getData(1)


const emit = defineEmits(["choose"])
const checkedImage = computed(() => list.value.filter( v => v.checked))

// 判断
const handleChooseChange = (item) => {
    if (item.checked && checkedImage.value.length > props.limit) {
        item.checked = false
        return myNotification(`最多选中${props.limit}张`, "error")
    }
    emit("choose", checkedImage.value)
}

</script>

<style>
.image-main {
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 10px;
    overflow-y: auto;
}

.image-main .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;
}

.image-title {
    position: absolute;
    top: 122px;
    right: -1px;
    left: -1px;
    @apply px-2 py-1 text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800;
}
</style>