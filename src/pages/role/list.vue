<template>
    <el-card shadow="never" class="border-0">
        <!-- 头部分 -->
        <ListHeader @create="handleCreate" @refresh="getData" />
        <!-- 主表格 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="desc" label="角色描述" width="280" />
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-switch :loading="row.statusLoading" :modelValue="row.status" :active-value="1"
                        :inactive-value="0" @change="handleStatusChange($event, row)" :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <!-- 配置权限 -->
                    <el-button type="primary" size="small" text @click="openSetRole(scope.row)">配置权限</el-button>
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

        <FormDrawer ref="formDraweRef" :title="title" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="normal">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <FormDrawer ref="setRoleFormDraweRef" title="配置权限" @submit="handleSetRoleSubmit">
            <el-tree-v2 :check-strictly="checkStrictly" ref="elTreeRef" style="max-width: 600px" :data="ruleList"
                :props="{ label: 'name', children: 'child' }" show-checkbox :height="treeHeight" node-key="id"
                :default-expanded-keys="defaultExpandedKeys" @check="handleTreeChecked">
                <template #default="{ node, data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu == 1 ? '' : 'info'" size="small">
                            {{ data.menu == 1 ? "菜单" : "权限" }}
                        </el-tag>
                        <span class="mr-2 text-sm">{{ data.name }}</span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>

    </el-card>
</template>

<script setup>
import { getRoleList, createRole, updateRole, deleteRole, updateRoleStatus, setRole } from '~/api/role';
import { getRuleList } from '~/api/rule';
import FormDrawer from '~/components/FormDrawer.vue';
import { useInitTable, useInitForm } from '~/composables/useCommon';
import ListHeader from '~/components/ListHeader.vue';
import { ref } from 'vue';
import { myNotification } from '~/composables/util';

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
    getList: getRoleList,
    delete: deleteRole,
    updateStatus: updateRoleStatus
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
        desc: ""
    },
    rules: {},
    getData,
    update: updateRole,
    create: createRole
})

// 配置路由
const setRoleFormDraweRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])

// 默认选中 | 设置目前勾选的节点
const ruleIds = ref([])
const elTreeRef = ref(null)
const checkStrictly = ref(false)


const openSetRole = (row) => {
    roleId.value = row.id
    treeHeight.value = window.innerHeight - 180
    checkStrictly.value = true
    getRuleList(1).then(res => {
        ruleList.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
        setRoleFormDraweRef.value.open()
        // 获取当前角色拥有的权限id
        ruleIds.value = row.rules.map(o => o.id)
        setTimeout(() => {
            elTreeRef.value.setCheckedKeys(ruleIds.value)
        }, 150)
        checkStrictly.value = false
    })
}

// 提交表单
const handleSetRoleSubmit = () => {
    setRoleFormDraweRef.value.showLoading()
    setRole(roleId.value, ruleIds.value)
        .then(res => {
            myNotification("操作成功")
            getData()
            setRoleFormDraweRef.value.close()
        })
        .finally(() => setRoleFormDraweRef.value.hideLoading())
}

// 获取被选中的选项
const handleTreeChecked = (...e) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}

</script>