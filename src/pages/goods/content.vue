<template>
    <FormDrawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destroy-on-close>
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content" />
            </el-form-item>
        </el-form>
    </FormDrawer>

</template>

<script setup>
import { reactive, ref } from 'vue';
import { setBanners, readGoods } from '~/api/goods';
import { myNotification } from '~/composables/util';
import FormDrawer from '~/components/FormDrawer.vue';   
import Editor from '~/components/Editor.vue';   

// 弹框组件ref
const formDrawerRef = ref(null)


const goods_id = ref(0)
const form = reactive({
    content: ""
})

const open = (row) => {
    goods_id.value = row.id
    row.contentLoading = true
    readGoods(goods_id.value).then(res => {
        form.banners = res.goodsBanner.map(o => o.url)
        formDrawerRef.value.open()
    }).finally(() => {
        row.contentLoading = false
    })
    
}
const loading = ref(false)
const emit = defineEmits(["reloadData"])

const submit = () => {
    // loading.value = true
    // setBanners(goods_id.value, form)
    //     .then(res => {
    //         myNotification("设置轮播图成功")
    //         dialogVisible.value = false
    //         emit("reloadData")
    //     })
    //     .finally(() => loading.value = false)
}

defineExpose({
    open
})

</script>