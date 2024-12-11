import { reactive, ref, computed } from 'vue';
import { myNotification } from '~/composables/util';


// 列表 | 文件 | 搜索 | 修改状态 | 删除
export function useInitTable(opt = {}) {

    let searchForm = null
    let resetSearchForm = null
    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        resetSearchForm = () => {
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
            getData()
        }
    }


    const tableData = ref([])
    const loading = ref(false)
    // 分页
    const currentPage = ref(1)
    const limit = ref(10)
    const total = ref(0)

    function getData(p = null) {
        if (typeof p == "number") {
            currentPage.value = p
        }
        loading.value = true
        opt.getList(currentPage.value, searchForm)
            .then(res => {
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
                    opt.onGetListSuccess(res)
                } else {
                    tableData.value = res.list
                    total.value = res.totalCount
                }
            })
            .finally(() => loading.value = false)
    }

    getData()

    // 删除
    const handleDelete = (fid) => {
        loading.value = true
        opt.delete(fid)
            .then(res => {
                myNotification("删除成功")
                getData()
            })
            .finally(() => loading.value = false)
    }

    // 状态更改
    const handleStatusChange = (status, row) => {
        row.statusLoading = true
        opt.updateStatus(row.id, status)
            .then(res => {
                myNotification("修改状态成功")
                row.status = status
                getData()
            })
            .finally(() => row.statusLoading = false)
    }

    // 接收选中的多选结果
    const multiSelectionIds = ref([])
    const handleSelectionChange = (e) => {
        multiSelectionIds.value = e.map(o => o.id)
    }
    // 批量删除
    const multipleTableRef = ref(null)
    const handleMultiDelete = () => {
        loading.value = true
        opt.delete(multiSelectionIds.value)
            .then(res => {
                myNotification("删除成功")
                // 清空选中
                if (multipleTableRef.value) {
                    multipleTableRef.value.clearSelection()
                }
                getData()

            })
            .finally(() => loading.value = false)
    }

    // 批量修改状态
    const handleMultiStatusChange = (status) => {
        loading.value = true
        opt.updateStatus(multiSelectionIds.value, status)
            .then(res => {
                myNotification((status? "上架" : "下架") + "成功")
                // 清空选中
                if (multipleTableRef.value) {
                    multipleTableRef.value.clearSelection()
                }
                getData()

            })
            .finally(() => loading.value = false)
    }

    return {
        searchForm,
        resetSearchForm,
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
        handleMultiDelete,
        handleMultiStatusChange
    }
}

// 新增 | 修改
export function useInitForm(opt = {}) {
    // 表单
    const editId = ref(0)
    const title = computed(() => editId.value ? "修改" : "新增")
    const formDraweRef = ref(null)
    const formRef = ref(null)
    const form = reactive({})
    const defaultForm = opt.form
    const rules = opt.rules || {}

    // 重置表单
    function resetForm(row = false) {
        if (formRef.value) {
            formRef.value.clearValidate()
        }
        for (const key in defaultForm) {
            form[key] = row[key]
        }
    }

    // 打开侧边栏 -新增
    const handleCreate = () => {
        editId.value = 0
        resetForm(defaultForm)
        formDraweRef.value.open()
    }

    // 打开侧边栏-修改
    const handleEdit = (row) => {
        editId.value = row.id
        resetForm(row)
        formDraweRef.value.open()
    }

    const handleSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) return
            formDraweRef.value.showLoading()

            let body = {}
            if (opt.beforeSubmit && typeof opt.beforeSubmit == "function") {
                body = opt.beforeSubmit({...form})
            } else {
                body = form
            }

            const submiTFunc = editId.value ? opt.update(editId.value, body) : opt.create(body)
            submiTFunc
                .then(res => {
                    myNotification(title.value + "操作成功")
                    opt.getData(editId.value ? false : 1)
                    formDraweRef.value.hideLoading()
                })
                .finally(() => formDraweRef.value.close())
        })
    }

    return {
        title,
        formDraweRef,
        formRef,
        form,
        rules,
        editId,
        handleCreate,
        handleEdit,
        handleSubmit,
        resetForm
    }

}
