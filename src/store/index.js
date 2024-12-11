import { createStore } from 'vuex'
import { getInfo, login } from '~/api/manager'
import { removeToken, setToken } from '~/composables/auth'

const store = createStore({
    state() {
        return {
            user: {},
            asideWidth: "250px",
            menus: [],
            ruleNames: [],
        }
    },
    mutations: {
        SET_USERINFO(state, userInfo) {
            state.user = userInfo
        },
        handleAsideWidth(state){
            state.asideWidth = state.asideWidth == "250px"? "64px" : "250px"
        },
        SET_MENUS(state, menus){
            state.menus = menus
        },
        SET_RULENAMES(state, ruleNames){
            state.ruleNames = ruleNames
        }
    },
    actions: {
        // 登录
        login({ commit }, { username, password }) {
            return new Promise((reslove, reject) => {
                login(username, password)
                    .then(
                        res => {
                            setToken(res.token)
                            reslove(res)
                        })
                    .catch(err => reject(err))
            })
        },

        // 获取当前用户登录信息
        getinfo({ commit }) {
            return new Promise((reslove, reject) => {
                getInfo().then(
                    res => {
                        commit("SET_USERINFO", res)
                        commit("SET_MENUS", res.menus)
                        commit("SET_RULENAMES", res.ruleNames)
                        reslove(res)
                    }
                ).catch(err => reject(err))
            })
        },

        // 退出登录
        logout({commit}){
            // 删除 cookie中的token
            removeToken()
            // 清楚 state 的状态
            commit("SET_USERINFO", {})
        }
    }
})

export default store