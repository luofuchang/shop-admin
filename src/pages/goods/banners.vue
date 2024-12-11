<template>
    <el-drawer title="设置轮播图" v-model="dialogVisible" size="40%" destroy-on-close>
        <el-form :model="form" label-width="80px">
            <el-form-item label="轮播图">
                <ChooseImage :limit="9" v-model="form.banners" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

</template>

<script setup>
import { reactive, ref } from 'vue';
import ChooseImage from '~/components/ChooseImage.vue';
import { setBanners, readGoods } from '~/api/goods';
import { myNotification } from '~/composables/util';

const goods_id = ref(0)
const dialogVisible = ref(false)
const form = reactive({
    banners: []
})



const open = (row) => {
    goods_id.value = row.id
    row.bannersLoading = true
    readGoods(goods_id.value).then(res => {
        form.banners = res.goodsBanner.map(o => o.url)
        dialogVisible.value = true
    }).finally(() => {
        row.bannersLoading = false
    })
    
}
const loading = ref(false)
const emit = defineEmits(["reloadData"])

const submit = () => {
    loading.value = true
    setBanners(goods_id.value, form)
        .then(res => {
            myNotification("设置轮播图成功")
            dialogVisible.value = false
            emit("reloadData")
        })
        .finally(() => loading.value = false)
}

defineExpose({
    open
})

</script>