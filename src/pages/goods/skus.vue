<template>
    <FormDrawer size="70%" ref="formDrawerRef" title="设置商品规格" @submit="submit" destroy-on-close>
        <el-form :model="form" :label-width="'80'">
            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :value="0">单规格</el-radio>
                    <el-radio :value="1">多规格</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 单规格 -->
            <template v-if="form.sku_type == 0">
                <el-form-item label="原价">
                    <el-input v-model="form.sku_value.oprice" type="number" placeholder="请输入原价" style="width: 40%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价">
                    <el-input v-model="form.sku_value.pprice" type="number" placeholder="请输入销售价" style="width: 40%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="成本价">
                    <el-input v-model="form.sku_value.cprice" type="number" placeholder="请输入成本价" style="width: 40%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="重量">
                    <el-input v-model="form.sku_value.weight" type="number" placeholder="请输入重量" style="width: 40%;">
                        <template #append>kg</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="体积">
                    <el-input v-model="form.sku_value.volume" type="number" placeholder="请输入体积" style="width: 40%;">
                        <template #append>m³</template>
                    </el-input>
                </el-form-item>

            </template>
            <!-- 多规格 -->
            <template v-else>
                <SkuCard />
            </template>
        </el-form>
    </FormDrawer>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { updateSkus, readGoods } from '~/api/goods';
import FormDrawer from '~/components/FormDrawer.vue';
import { myNotification } from '~/composables/util';
import SkuCard from './components/SkuCard.vue';
import { goods_id, initSkuCardList } from '~/composables/useSkus'

// 弹框组件ref
const formDrawerRef = ref(null)

// 提交更改所需参数
const form = reactive({
    sku_type: 0,
    "sku_value": {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
    }
})

/**
 * 打开商品详情对话框
 * 
 * 此函数用于当用户想要查看或编辑商品详情时调用它会初始化商品信息，
 * 并显示商品详情对话框，在此过程中会禁用当前行的加载状态以提升用户体验
 * 
 * @param {Object} row - 表格行数据，包含商品信息和加载状态
 */
const open = (row) => {
    // 设置当前操作的商品ID
    goods_id.value = row.id
    // 设置行数据的加载状态为true
    row.skusLoading = true
    // 读取商品信息
    readGoods(goods_id.value).then(res => {
        form.sku_type = res.sku_type
        form.sku_value = res.sku_value || {
            "oprice": 0,
            "pprice": 0,
            "cprice": 0,
            "weight": 0,
            "volume": 0
        }
        initSkuCardList(res)
        // 打开商品详情对话框
        formDrawerRef.value.open()
    }).finally(() => {
        // 无论读取操作成功或失败，都重置行数据的加载状态
        row.skusLoading = false
    })

}
const emit = defineEmits(["reloadData"])

/**
 * 提交函数，用于更新商品规格信息
 * 此函数首先显示表单加载状态，然后调用updateSkus函数更新商品规格
 * 更新成功后，显示成功通知，关闭表单抽屉，并触发父组件的reloadData事件以重新加载数据
 * 无论成功与否，最后都会隐藏表单的加载状态
 */
const submit = () => {
    // 显示表单加载状态
    formDrawerRef.value.showLoading()
    
    // 调用更新商品规格的API
    updateSkus(goods_id.value, form)
        .then(res => {
            // 更新成功后，显示通知
            myNotification("设置商品规格成功")
            // 关闭表单抽屉
            formDrawerRef.value.close()
            // 触发父组件的reloadData事件，以便重新加载数据
            emit("reloadData")
        })
        .finally(() => {
            // 无论成功与否，最后都隐藏表单的加载状态
            formDrawerRef.value.hideLoading()
        })
}

defineExpose({
    open
})

</script>