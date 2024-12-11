import { createRouter, createWebHashHistory } from "vue-router"
import Index from "~/pages/index.vue"
import Login from "~/pages/login.vue"
import NotFound from "~/pages/404.vue"
import Admin from "~/layouts/admin.vue"
import GoodList from '~/pages/goods/list.vue'
import CategoryList from '~/pages/category/list.vue'
import UserList from '~/pages/user/list.vue'
import OrderList from '~/pages/order/list.vue'
import CommentList from '~/pages/comment/list.vue'
import ImageList from '~/pages/image/list.vue'
import NoticeList from '~/pages/notice/list.vue'
import CouponList from '~/pages/coupon/list.vue'
import SettingBase from '~/pages/setting/base.vue'
import ManagerList from '~/pages/manager/list.vue'
import AccessList from '~/pages/access/list.vue'
import RoleList from '~/pages/role/list.vue'
import SkusList from '~/pages/skus/list.vue'

const routes = [
    {
        path: '/',
        name: "admin",
        component: Admin

    },
    {
        path: '/login',
        component: Login,
        meta: { title: "登录" }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: { title: "404!" }
    }
]

const asyncRoutes = [
    {
        path: '/',
        component: Index,
        name: "/",
        meta: { title: "后台首页" }
    },
    {
        path: '/goods/list',
        component: GoodList,
        name: "/goods/list",
        meta: { title: "商品列表" }
    },
    {
        path: '/category/list',
        component: CategoryList,
        name: "/category/list",
        meta: { title: "分类列表" }
    },
    {
        path: '/user/list',
        component: UserList,
        name: "/user/list",
        meta: { title: "用户列表" }
    },
    {
        path: '/order/list',
        component: OrderList,
        name: "/order/list",
        meta: { title: "订单列表" }
    },
    {
        path: '/comment/list',
        component: CommentList,
        name: "/comment/list",
        meta: { title: "评价列表" }
    },
    {
        path: '/image/list',
        component: ImageList,
        name: "/image/list",
        meta: { title: "图库列表" }
    },
    {
        path: '/notice/list',
        component: NoticeList,
        name: "/notice/list",
        meta: { title: "公告列表" }
    },
    {
        path: '/coupon/list',
        component: CouponList,
        name: "/coupon/list",
        meta: { title: "优惠券列表" }
    },
    {
        path: '/setting/base',
        component: SettingBase,
        name: "/setting/base",
        meta: { title: "配置" }
    },
    {
        path: '/manager/list',
        component: ManagerList,
        name: "/manager/list",
        meta: { title: "管理员管理" }
    },
    {
        path: '/access/list',
        component: AccessList,
        name: "/access/list",
        meta: { title: "菜单权限管理" }
    },
    {
        path: '/role/list',
        component: RoleList,
        name: "/role/list",
        meta: { title: "角色管理" }
    }
    ,
    {
        path: '/skus/list',
        component: SkusList,
        name: "/skus/list",
        meta: { title: "商品规格" }
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export function addRoutes(menus) {
    let hasNewRoute = false
    const findAndAddRoute = (arr) => {
        arr.forEach( element => {
            // 找出已经存在的路由
            let item = asyncRoutes.find((route) => route.path == element.frontpath)
            // 如果后端传回的数据包含 路由信息，但是路由表存在，所以要添加到路由表中去
            if (item && !router.hasRoute(item.path)) {
                router.addRoute("admin", item)
                hasNewRoute = true
            }
            if (element.child && element.child.length > 0) {
                findAndAddRoute(element.child)
            }
        })
    }
    findAndAddRoute(menus)
    return hasNewRoute
}
