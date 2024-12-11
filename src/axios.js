import axios from 'axios'
import {getToken} from '~/composables/auth'
import { myNotification } from '~/composables/util';
import store from './store';

const service = axios.create({
    baseURL: '/api'
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前把token属性加入header
    const token = getToken()
    if (token) {
        config.headers['token'] = token
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 精简响应数据
    return response.data.data;
}, function (error) {
    const msg = error.response.data.msg || "请求失败，未知错误"
    if(msg == "非法token,请先登录!"){
        store.dispatch("logout").finally(() => location.reload())
    }
    // 弹出错误通知
    myNotification( msg , "error")
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default service