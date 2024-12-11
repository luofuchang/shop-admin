<template>
    {{ d.num.toFixed(0) }}
</template>

<script setup>

import { reactive, watch } from 'vue'
import gsap from 'gsap';

const d = reactive({
    num: 0
})

// 使用 defineProps 接收从父组件传来的数值
const props = defineProps({
    value: {
        type: Number,
        defalut: 0
    }
})

//动画方法
function animateToValue(){
    gsap.to(d, { duration: 0.5, num: props.value})
}

animateToValue()

//监听
watch(() => {{ props.value }}, () => animateToValue())
</script>