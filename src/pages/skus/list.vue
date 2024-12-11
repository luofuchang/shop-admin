<template>
    <el-card shadow="never" class="border-0">
        <!-- 头部分 -->
        <ListHeader layout="create,delete,refresh" @create="handleCreate" @refresh="getData"
            @delete="handleMultiDelete" />
        <!-- 主表格 -->
        <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
            style="width: 100%" v-loading="loading">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="规格名称" />
            <el-table-column prop="default" label="规格值" width="280" />
            <el-table-column prop="order" label="排序" />
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-switch :loading="row.statusLoading" :modelValue="row.status" :active-value="1"
                        :inactive-value="0" @change="handleStatusChange($event, row)" :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <!-- 修改按钮 -->
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                    <!-- 删除按钮 -->
                    <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" text>删除</el-button>
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

        <FormDrawer ref="formDraweRef" :title="title" @submit="handleSubmit" destoryOnClose>
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="normal">
                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" size="normal" :min="1" :max="1000">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="规格值" prop="default">
                    <TagInput v-model="form.default" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { getSkusList, createSkus, updateSkus, deleteSkus, updateSkusStatus } from '~/api/skus';
import FormDrawer from '~/components/FormDrawer.vue';
import { useInitTable, useInitForm } from '~/composables/useCommon';
import ListHeader from '~/components/ListHeader.vue';
import TagInput from '~/components/TagInput.vue';

const {
    tableData,
    loading,
    currentPage,
    limit,
    total,
    getData,
    handleDelete,
    handleStatusChange,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete
} = useInitTable({
    getList: getSkusList,
    delete: deleteSkus,
    updateStatus: updateSkusStatus
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
        status: 1,
        order: 50,
        default: ""
    },
    rules: {},
    getData,
    update: updateSkus,
    create: createSkus
})


</script>