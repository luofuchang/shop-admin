<template>
    <div v-loading="loading" class="flex gap-2">
        <el-tag v-for="(tag, index) in item.goodsSkusCardValue" :key="index" closable :disable-transitions="false"
            @close="handleClose(tag)" effect="plain">

            <el-input placeholder="规格值" class="w-20 ml-[-10px]" v-model="tag.text" size="small"
                @change="handleChange($event, tag)">
            </el-input>

        </el-tag>

        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />

        <el-button v-else class="button-new-tag" size="small" @click="showInput">
            添加规格值
        </el-button>
    </div>
</template>

<script setup>
import { initSkuCardItem } from '~/composables/useSkus'

const props = defineProps({
    skuCardId: [String, Number],
});
const {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange
} = initSkuCardItem(props.skuCardId);
</script>