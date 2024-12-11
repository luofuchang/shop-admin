<template>
    <FormDrawer size="50%" ref="formDrawerRef" title="设置商品详情" @submit="submit" destroy-on-close>
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content" />
            </el-form-item>
        </el-form>
    </FormDrawer>

</template>

<script setup>
import { reactive, ref } from 'vue';
import { updateGoods, readGoods } from '~/api/goods';
import FormDrawer from '~/components/FormDrawer.vue';   
import Editor from '~/components/Editor.vue';
import { myNotification } from '~/composables/util';

// 弹框组件ref
const formDrawerRef = ref(null)

// 提交更改所需参数，id和content
const goods_id = ref(0)
const form = reactive({
    content: ""
})

const open = (row) => {
    goods_id.value = row.id
    row.contentLoading = true
    readGoods(goods_id.value).then(res => {
        form.content = res.content
        formDrawerRef.value.open()
    }).finally(() => {
        row.contentLoading = false
    })
    
}
const emit = defineEmits(["reloadData"])

const submit = () => {
    formDrawerRef.value.showLoading()
    updateGoods(goods_id.value, form)
        .then(res => {
            myNotification("设置商品详情成功")
            formDrawerRef.value.close()
            emit("reloadData")
        })
        .finally(() => formDrawerRef.value.hideLoading())
}

defineExpose({
    open
})

</script>