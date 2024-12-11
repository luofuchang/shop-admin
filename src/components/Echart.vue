<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm">订单统计</span>
                <div>
                    <el-check-tag :checked="current == item.value" style="margin-right: 8px;" 
                    v-for="(item, index) in options" :key="index" @click="handleChoose(item.value)">
                        {{ item.text }}
                    </el-check-tag>
                </div>
            </div>
        </template>
        <!-- 定义 echart -->
         <div id="echart" style="height: 300px; width: 100%;" ref="el">
         </div>
    </el-card>
    
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getStatistics3 } from '~/api';
import { useResizeObserver } from '@vueuse/core';

const current = ref("week")
const el = ref(null)

const options = [
    {
        text: "近一个月",
        value: "month"
    },
    {
        text: "近一周",
        value: "week"
    },
    {
        text: "近24小时",
        value: "hour"
    }
]

function getData(){

    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
            data: [],
            type: 'bar'
            }
        ]
    };

    // option && myChart.setOption(option);

    myChart.showLoading()
    getStatistics3(current.value).then(res => {
        option.xAxis.data = res.x
        option.series[0].data = res.y
        myChart.setOption(option)
    }).finally(() => myChart.hideLoading())
}

var myChart = null
const handleChoose = (type) => {
    current.value = type
    getData()
}

// 创建实例
onMounted(() => {
    var chartDom = document.getElementById('echart');
    if(chartDom){
        myChart = echarts.init(chartDom);
        getData()
    }
})

// 销毁实例
onBeforeUnmount(() => {
    if(myChart) echarts.dispose(myChart)
})

useResizeObserver(el, (entries) => myChart.resize())


</script>

<style scoped>

</style>