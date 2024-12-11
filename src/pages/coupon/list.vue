<template>
    <el-card shadow="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData" />

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column label="优惠券名称" width="350">
                <template #default="{ row }">
                    <div :class="row.statusText == '领取中'? 'active' : 'inactive'"
                        class="border border-dashed py-2 px-4 rounded">
                        <h5 class="font-bold text-md">{{ row.name }}</h5>
                        <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="statusText" label="状态" />
            <el-table-column prop="statusText" label="优惠">
                <template #default="{ row }">
                    {{ row.type == 0 ? "满减" : "折扣" }} {{ row.type == 0 ? ("￥" + row.value) : (row.value + "折") }}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量" />
            <el-table-column prop="used" label="已使用" />
            <el-table-column prop="create_time" label="创建时间" width="380" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <!-- 修改 -->
                    <el-button v-if="scope.row.statusText == '未开始'" type="primary" size="small" text
                        @click="handleEdit(scope.row)">修改</el-button>
                    <!-- 删除 -->
                    <el-popconfirm v-if="scope.row.statusText != '领取中'" title="确认删除?"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                    <!-- 失效 -->
                    <el-popconfirm v-if="scope.row.statusText == '领取中'" title="确认失效?"
                        @confirm="handleStatusChange(0, scope.row)">
                        <template #reference>
                            <el-button type="danger" size="small">失效</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页部分 -->
        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev, pager, next" @current-change="getData" :total="total"
                :current-page="currentPage" :page-size="limit" />
        </div>

        <FormDrawer ref="formDraweRef" :title="title" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="优惠券名称" prop="name">
                    <el-input v-model="form.name" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0"> 满减 </el-radio>
                        <el-radio :label="1"> 折扣 </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value">
                    <el-input v-model="form.value" style="width: 50%">
                        <template #append>
                            {{ form.type ? "折" : "元" }}
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发行量" prop="total">
                    <el-input-number v-model="form.total" :min="1" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="最低使用价格" prop="min_price">
                    <el-input v-model="form.min_price" type="number" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="1" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="活动时间" prop="content">
                    <!-- <el-input v-model="form.content"></el-input> -->
                    <el-date-picker v-model="timerange" type="datetimerange" range-separator="To"
                        start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" type="textarea"></el-input>
                </el-form-item>
            </el-form>

        </FormDrawer>

    </el-card>
</template>

<script setup>
import { getCouponList, createCoupon, updateCoupon, deleteCoupon, updateCouponStatus } from '~/api/coupon';
import FormDrawer from '~/components/FormDrawer.vue';
import { useInitTable, useInitForm } from '~/composables/useCommon';
import ListHeader from '~/components/ListHeader.vue';
import { computed } from 'vue';

const {
    tableData,
    loading,
    currentPage,
    limit,
    total,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getCouponList,
    delete: deleteCoupon,
    updateStatus: updateCouponStatus,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.statusText = formatStatus(o)
            return o
        })
        total.value = res.totalCount
    }
})

const {
    title,
    formDraweRef,
    formRef,
    form,
    rules,
    handleCreate,
    handleEdit,
    handleSubmit
} = useInitForm({
    form: {
        name: "",
        type: 0,
        value: 0,
        total: 100,
        min_price: 0,
        start_time: null,
        start_time: null,
        desc: "",
        order: 50

    },
    rules: {},
    getData,
    update: updateCoupon,
    create: createCoupon,
    beforeSubmit: (f) => {
        if (typeof f.start_time != "number") {
            f.start_time = new Date(f.start_time).getTime()
        }
        if (typeof f.end_time != "number") {
            f.end_time = new Date(f.end_time).getTime()
        }
        return f
    }
})

// 格式化优惠券的状态
function formatStatus(row) {
    let s = "领取中"
    let start_time = (new Date(row.start_time)).getTime()
    let now = (new Date()).getTime()
    let end_time = (new Date(row.end_time)).getTime()
    if (start_time > now) {
        s = "未开始"
    } else if (end_time < now) {
        s = "已结束"
    } else if (row.status == 0) {
        s = "已失效"
    }
    return s
}

// 计算时间范围
const timerange = computed({
    get(){
        return form.start_time && form.end_time? [form.start_time, form.end_time] : []
    },
    set(val) {
        form.start_time = val[0]
        form.end_time = val[1]
    }
})

</script>

<style scoped>
.active{
    @apply border-rose-200 bg-rose-50 text-red-400;
}

.inactive {
    @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>