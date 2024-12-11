<template>
    <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">
            <AsideList v-for="(item, index) in list" :key="index" :active="activeId == item.id" @edit="handleEdit(item)"
                @delete="handleDelete(item.id)" @click="handleActiveId(item.id)">
                {{ item.name }}
            </AsideList>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev, next" @current-change="getImageClass" :total="total"
                :current-page="currentPage" :page-size="limit" />
        </div>
    </el-aside>
    <FormDrawer :title="drawTitle" ref="formDrawerRef" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number :min="0" :max="1000" v-model="form.order" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import AsideList from './AsideList.vue';
import { getImageClassList, createImageClassList, updateImageClass, deleteImageClass } from '~/api/image-class';
import FormDrawer from './FormDrawer.vue';
import { myNotification, myMessageBox } from '~/composables/util';


const list = ref([])
const loading = ref(false)
const activeId = ref(0)
// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
// 子组件
const formDrawerRef = ref(null)
const formRef = ref(null)

const editId = ref(0)

const drawTitle = computed(() => editId.value == 0 ? "新增分类" : "修改分类")

// 抽屉表单
const form = reactive({
    name: "",
    order: 50
})
const rules = {
    name: [{
        required: true,
        message: "can not be empty",
        trigger: 'blur'
    }]
}

// 获取分类列表
function getImageClass(p = null) {
    if (typeof p == "number") {
        currentPage.value = p
    }
    loading.value = true
    getImageClassList(currentPage.value).then(res => {
        total.value = res.totalCount
        list.value = res.list
        let item = list.value[0]
        if (item) handleActiveId(item.id)
    })
        .finally(() => loading.value = false)
}
getImageClass()

// 提交
const handleSubmit = () => {
    // 验证
    formRef.value.validate((valid) => {
        if (!valid) return
        console.log("提交通过");
        formDrawerRef.value.showLoading()
        const submitFunc = editId.value ? updateImageClass(editId.value, form) : createImageClassList(form)
        submitFunc
            .then(res => {
                myNotification(drawTitle.value + "成功")
                getImageClass(editId.value ? currentPage.value : 1)
                formDrawerRef.value.close()
            })
            .finally(() => formDrawerRef.value.hideLoading())
    })
}
// 新增分类
const handleCreate = () => {
    editId.value = 0
    form.name = '',
    form.order = 50
    formDrawerRef.value.open()
}
defineExpose({ handleCreate })

// 编辑分类
const handleEdit = (item) => {
    editId.value = item.id
    form.name = item.name
    form.order = item.order
    formDrawerRef.value.open()
}

const handleDelete = (id) => {
    loading.value = true
    deleteImageClass(id)
        .then(result => {            
            getImageClass(1)
            myNotification("删除成功")
        })
        .finally(() => loading.value = false)
}

// 选中图库分类id
function handleActiveId(id) {
    activeId.value = id
    emit("change", id)
}

// 暴露一个change方法给list.vue
const emit = defineEmits(["change"])

</script>
<style>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
    /* @apply flex items-center */
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 10px;
    overflow-y: auto;
}

.image-aside .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;
}
</style>