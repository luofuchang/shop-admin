<template>
    <div class="flex items-center">
        <el-icon :size="20" v-if="modelValue" class="mr-2">
            <component :is="modelValue" />
        </el-icon>
        <el-select filterable @change="handleChange" :modelValue="modelValue" placeholder="请选择图标" class="m-2"
            style="width: 150px">
            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                <div class="flex items-center justify-between">
                    <el-icon>
                        <component :is="item" />
                    </el-icon>
                    <span class="text-gray-500">{{ item }}</span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import * as IconList from '@element-plus/icons-vue'

const icons = ref(Object.keys(IconList))

defineProps({
    modelValue: String
})

const emit = defineEmits(["update:modelValue"])

const handleChange = (icon) => {
    emit("update:modelValue", icon)
}

</script>