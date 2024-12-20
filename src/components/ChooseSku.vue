<template>
    <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
        <el-container style="height: 65vh;">
            <el-aside width="220px" class="image-aside">
                <div class="top">
                    <!-- 数据渲染 -->
                    <div class="sku-lits" v-for="(item, index) in tableData" :key="index"
                        @click="handleActiveId(item.id)" :class="{ 'active': (activeId == item.id) }">
                        {{ item.name }}
                    </div>
                </div>
                <div class="bottom">
                    <el-pagination background layout="prev, next" @current-change="getData" :total="total"
                        :current-page="currentPage" :page-size="limit" />
                </div>
            </el-aside>
            <el-main>
                <el-checkbox-group v-model="form.list" >
                    <el-checkbox border v-for="item in list" :key="item" :label="item">
                        {{item}}
                    </el-checkbox>
                </el-checkbox-group>
                
            </el-main>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submit">OK</el-button>
            </span>
        </template>
    </el-dialog>

</template>


<script setup>
import { reactive, ref } from 'vue';
import { getSkusList } from '~/api/skus';
import { useInitTable } from '~/composables/useCommon';

// 弹框组件的显示与隐藏
const dialogVisible = ref(false)
// 左侧激活选中的选项
const activeId = ref(0)
// 展示数据
const list = ref([])
// checkbox表单数据
const form = reactive({
    list: [],
    name: ''
})

const { loading, currentPage, limit, total, tableData, getData } = useInitTable({
    getList: getSkusList,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        total.value = res.totalCount
        if (tableData.value.length > 0) {
            handleActiveId(tableData.value[0].id)
        }
    }
})

/**
 * 处理激活的ID并更新相关列表
 * 当激活的ID发生变化时，此函数会被调用，它会清空列表并根据新的激活ID来更新列表
 * @param {string} id - 新的激活ID，用于查找和更新列表
 */
function handleActiveId (id){
    // 更新激活的ID
    activeId.value = id
    // 清空列表，准备根据新的激活ID进行更新
    list.value = []
    // 查找与激活ID匹配的数据项
    let temp = tableData.value.find(o => o.id == id)
    // 如果找到了匹配的数据项，则将其默认值分割并更新列表
    if (temp) {
        list.value = temp.default.split(',')
        form.name = temp.name
    }
}

/**
 * 提交操作的处理函数
 * 无参数和返回值
 * 在执行提交逻辑时使用
 */
const submit = () => {
    console.log('submit')
    if (typeof callbackFunc.value === 'function') {
        callbackFunc.value(form)
    }
    dialogVisible.value = false
}

const callbackFunc = ref(null)

const open = ((callback = null) => {
    callbackFunc.value = callback
    getData(1)
    dialogVisible.value = true
})

defineExpose({ open })

</script>

<style>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
    /* @apply flex items-center */
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 10px;
    overflow-y: auto;
}

.image-aside .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;
}

.sku-lits {
    border-bottom: 1px solid #f4f4f4;
    @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}

.sku-lits:hover,
.active {
    @apply bg-blue-100;
}
</style>