import { router, addRoutes } from "~/router"
import { getToken } from "~/composables/auth"
import { hideFullLoading, myNotification, showFullLoading } from "./composables/util";
import store from "./store";

let hasGetInfo = false

// 全局前置守卫
router.beforeEach( async(to, from, next) => {

    showFullLoading()

    const token = getToken()

    // 未登录且不是去登录的劫持到 /login下
    if(!token && to.path != "/login"){
        myNotification("您未登录", "error")
        return next({
            path : "/login"
        })
    }

    // 已经登录的又去了登录页面直接遣返或者转到首页去
    if(token && to.path == "/login"){
        myNotification("您已经登录", "warning")
        return next({path : from.path ? from.path : "/"})
    }

    let hasNewRoute = false
    // 用户登录后自动获取用户信息，，并储存在vuex中
    if(token && !hasGetInfo){
        let { menus } = await store.dispatch("getinfo")
        hasGetInfo = true
        // 动态添加路由
        hasNewRoute = addRoutes(menus)
    }

    let title = to.meta.title + "--VUE开发"

    document.title = title
    
    hasNewRoute? next(to.fullPath) : next()
    // next()
})

// 路由后置钩子

router.afterEach((to, from) => hideFullLoading())