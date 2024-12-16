<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name"
                :name="item.key"></el-tab-pane>
        </el-tabs>
        <el-card shadow="never" class="border-0 w-full">
            <!-- 搜索 -->
            <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
                <SearchItem label="关键词">
                    <el-input v-model="searchForm.title" placeholder="商品名" clearable></el-input>
                </SearchItem>
                <template #show>
                    <SearchItem label="商品分类">
                        <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
                            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </SearchItem>
                </template>
            </Search>

            <!-- 新增 | 刷新 -->
            <ListHeader layout="create,refresh,delete" @create="handleCreate" @refresh="getData"
                @delete="handleMultiDelete">
                <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'off'" size="small"
                    @click="handleMultiStatusChange(1)">上架</el-button>
                <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'" size="small"
                    @click="handleMultiStatusChange(0)">下架</el-button>
            </ListHeader>

            <!-- 表格商品列表样式 -->
            <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
                style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="400">
                    <template #default="{ row }">
                        <div class="flex">
                            <el-image class="mr-3 rounded" style="width:50px; height:50px;" :src="row.cover" fit="cover"
                                :lazy="true"></el-image>
                            <div class="flex-1">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                                    <el-divider direction="vertical" />
                                    <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">分类:{{ row.category ? row.category.name : "未分类" }}
                                </p>
                                <p class="text-gray-400 text-xs">创建时间:{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际销量" width="80" align="center" prop="sale_count"></el-table-column>
                <el-table-column label="商品状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'">{{ row.status ? '上架' : '仓库' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column v-if="searchForm.tab != 'delete'" label="审核状态" width="150" align="center">
                    <template #default="{ row }">
                        <div class="flex flex-col" v-if="row.ischeck == 0">
                            <el-button type="success" size="small" plain>审核通过</el-button>
                            <el-button class="mt-2 !ml-0" type="danger" size="small" plain>审核拒绝</el-button>
                        </div>
                        <span v-else>{{ row.ischeck == 1 ? '通过' : '拒绝' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总库存" width="90" align="center" prop="stock"></el-table-column>

                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div v-if="searchForm.tab != 'delete'">
                            <!-- 修改 -->
                            <el-button class="px-1" type="primary" size="small" text
                                @click="handleEdit(scope.row)">修改</el-button>
                            <!-- 商品规格 -->
                            <el-button :loading="scope.row.skusLoading" @click="handleSetSkus(scope.row)" class="px-1"
                                type="primary" size="small" text>商品规格</el-button>
                            <!-- 设置轮播图 -->
                            <el-button :loading="scope.row.bannersLoading" @click="handleSetBanners(scope.row)"
                                class="px-1" :type="scope.row.goods_banner.length == 0 ? 'danger' : 'primary'"
                                size="small" text>设置轮播图</el-button>
                            <!-- 设置商品详情 -->
                            <el-button :type="!scope.row.content ? 'danger' : 'primary'" class="px-1" size="small" text
                                @click="handleSetContent(scope.row)"
                                :loading="scope.row.contentLoading">设置商品详情</el-button>
                            <!-- 删除 -->
                            <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
                                <template #reference>
                                    <el-button class="px-1" type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <span v-else>暂无操作</span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页部分 -->
            <div class="flex items-center justify-center mt-5">
                <el-pagination background layout="prev, pager, next" @current-change="getData" :total="total"
                    :current-page="currentPage" :page-size="limit" />
            </div>
            <!-- 弹出框 表单部分 -->
            <FormDrawer ref="formDraweRef" :title="title" @submit="handleSubmit" destoryOnClose>
                <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
                    <el-form-item label="商品名称" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="封面" prop="cover">
                        <ChooseImage v-model="form.cover" />
                    </el-form-item>
                    <el-form-item label="商品分类" prop="category_id">
                        <el-select v-model="form.category_id" placeholder="选择商品分类">
                            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="desc">
                        <el-input type="textarea" v-model="form.desc" placeholder="选填,商品描述"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit">
                        <el-input style="width: 50%;" v-model="form.unit" placeholder="请输入单位"></el-input>
                    </el-form-item>

                    <el-form-item label="总库存" prop="stock">
                        <el-input type="number" style="width: 40%;" v-model="form.stock">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存预警" prop="min_stock">
                        <el-input type="number" style="width: 40%;" v-model="form.min_stock">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低价格" prop="min_price">
                        <el-input type="number" style="width: 40%;" v-model="form.min_price">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低原价" prop="min_oprice">
                        <el-input type="number" style="width: 40%;" v-model="form.min_oprice">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存显示" prop="stock_display">
                        <el-radio-group v-model="form.stock_display">
                            <el-radio :value="0">隐藏</el-radio>
                            <el-radio :value="1">显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :value="0">放入仓库</el-radio>
                            <el-radio :value="1">立即上架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </FormDrawer>
        </el-card>

        <Banners ref="bannersRef" @reloadData="getData" />
        <Content ref="contentRef" @reloadData="getData" />
        <Skus ref="skusRef" @reloadData="getData" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import FormDrawer from '~/components/FormDrawer.vue';
import { getGoodsList, updateGoods, createGoods, updateGoodsStatus, deleteGoods } from '~/api/goods';
import ChooseImage from '~/components/ChooseImage.vue';
import { useInitTable, useInitForm } from '~/composables/useCommon';
import ListHeader from '~/components/ListHeader.vue';
import { getCategoryList } from '~/api/category';
import Search from '~/components/Search.vue';
import SearchItem from '~/components/SearchItem.vue';
import Banners from './banners.vue';
import Content from './content.vue';
import Skus from './skus.vue';

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    limit,
    total,
    getData,
    handleDelete,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete,
    handleMultiStatusChange
} = useInitTable({
    searchForm: {
        title: "",
        tab: "all",
        category_id: null
    },
    getList: getGoodsList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.bannersLoading = false
            o.contentLoading = false
            o.skusLoading = false
            return o
        }),
            total.value = res.totalCount
    },
    delete: deleteGoods,
    updateStatus: updateGoodsStatus
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
        title: null,
        category_id: null,
        cover: null,
        desc: null,
        unit: "件",
        stock: 100,
        min_stock: 10,
        status: 1,
        stock_display: 1,
        min_price: 0,
        min_oprice: 0
    },
    getData,
    update: updateGoods,
    create: createGoods
})


const tabbars = [
    {
        key: "all",
        name: "全部"
    },
    {
        key: "checking",
        name: "审核"
    },
    {
        key: "saling",
        name: "出售中"
    },
    {
        key: "off",
        name: "已下架"
    },
    {
        key: "min_stock",
        name: "库存预警"
    },
    {
        key: "delete",
        name: "回收站"
    }
]

// 获取商品分类列表数据
const categoryList = ref([])
getCategoryList().then(res => {
    categoryList.value = res
})

// 设置轮播图
const bannersRef = ref(null)
const handleSetBanners = (row) => bannersRef.value.open(row)

// 设置商品详情
const contentRef = ref(null)
const handleSetContent = (row) => contentRef.value.open(row)

// 设置商品规格
const skusRef = ref(null)
const handleSetSkus = (row) => skusRef.value.open(row)

</script>