<template>
    <div>
        <!-- 骨架 -->
        <el-row :gutter="20">
            <template v-if="panels.length == 0">
                <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%;" animated loading>
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="text" style="width: 50%;" />
                                        <el-skeleton-item variant="text" style="width: 10%;" />
                                    </div>
                                </template>
                                <el-skeleton-item variant="h3" style="width: 60%;" />
                                <el-divider />
                                <div class="flex justify-between text-sm text-gray-500">
                                    <el-skeleton-item variant="text" style="width: 40%;" />
                                    <el-skeleton-item variant="text" style="width: 20%;" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>
        </el-row>

        <!-- 数据展示区域 -->
        <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
                <el-card shadow="hover" class="border-0">
                    <template #header>
                        <div class="flex justify-between">
                            <span class="text-sm">{{ item.title }}</span>

                            <el-tag :type="item.unitColor ? item.unitColor : 'success'" effect="plain">
                                {{ item.unit }}
                            </el-tag>
                        </div>
                    </template>
                    <span class="text-3xl font-bold text-gray-500">
                        <CountTo :value="item.value" />
                    </span>
                    <el-divider />
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>{{ item.subTitle }}</span>
                        <span>{{ item.subValue }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 分类数据 -->
        <indexNavs />

        <!-- 图标区域 -->
        <el-row :gutter="20">
            <el-col :span="12" :offset="0">
                <Echart v-permission="['getStatistics3,GET']" />
            </el-col>
            <el-col :span="12" :offset="0">
                <!-- 卡片 -->
                <IndexCard :btns="goods" title="店铺及商品提示" tip="店铺及商品提示" />
                <IndexCard :btns="order" title="交易提示" tip="交易提示" />
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getStatistics1, getStatistics2 } from '~/api';
import CountTo from '~/components/CountTo.vue';
import Echart from '~/components/Echart.vue';
import indexNavs from '~/components/indexNavs.vue';
import IndexCard from '~/components/IndexCard.vue';

const panels = ref([])

// 从服务端获取数据渲染到 ref 中
getStatistics1().then(res => panels.value = res.panels);

const goods = ref([])
const order = ref([])
getStatistics2().then(res => {
    goods.value = res.goods
    order.value = res.order
})

</script>

<style scoped></style>