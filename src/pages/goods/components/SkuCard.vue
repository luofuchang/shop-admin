<template>
    <el-form-item v-loading="bodyLoading" label="规格选项">
        <el-card v-loading="item.loading" v-for="(item, index) in sku_card_list" :key="item.id" shadow="never"
            class="w-full mb-3">
            <template #header>
                <div class="flex items-center">
                    <el-input v-model="item.text" placeholder=" 规格名称" style="width: 200px;"
                        @change="edit_sku_card(item)">
                        <template #append>
                            <el-icon>
                                <MoreFilled />
                            </el-icon>
                        </template>
                    </el-input>
                    <el-button :disabled="index == 0" @click="sort_sku_card('up', index)" size="small" class="ml-auto">
                        <el-icon>
                            <Top />
                        </el-icon>
                    </el-button>
                    <el-button :disabled="index === sku_card_list.length - 1" @click="sort_sku_card('down', index)"
                        size="small">
                        <el-icon>
                            <Bottom />
                        </el-icon>
                    </el-button>
                    <el-button size="small" @click="delete_sku_card(item)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>

                </div>
            </template>
            <!-- card body -->
            <SkuCardItem :skuCardId="item.id" />
        </el-card>
        <el-button @click="add_sku_card" :loading="btnLoading" type="success" size="small">添加规格</el-button>
    </el-form-item>


</template>

<script setup>
import SkuCardItem from "./SkuCardItem.vue"
import { bodyLoading, sort_sku_card, delete_sku_card, edit_sku_card, sku_card_list, add_sku_card, btnLoading } from '~/composables/useSkus'


</script>
<style>
.el-card__header {
    @apply !p-2 bg-gray-50;
}
</style>