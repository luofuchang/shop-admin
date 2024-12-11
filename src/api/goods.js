import axios from "~/axios";
import { queryParamToUrl } from "~/composables/util";

export function getGoodsList(page, query = {}) {
    let r = queryParamToUrl(query)
    return axios.get(`/admin/goods/${page}${r}`)
}
// 批量上架下架
export function updateGoodsStatus(ids, status) {
    ids = !Array.isArray(ids) ? [ids] : ids
    return axios.post(`/admin/goods/changestatus`, { ids, status })
}


export function createGoods(data) {
    return axios.post('/admin/goods', data)
}

export function updateGoods(id, data) {
    return axios.post(`/admin/goods/${id}`, data)
}

export function deleteGoods(ids) {
    ids = !Array.isArray(ids) ? [ids] : ids
    return axios.post('/admin/goods/delete_all', { ids })
}

export function readGoods(id) {
    return axios.get(`/admin/goods/read/${id}`)
}

export function setBanners(id, data) {
    return axios.post(`admin/goods/banners/${id}`, data)
}