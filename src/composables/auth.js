import { useCookies } from '@vueuse/integrations/useCookies'


const cookie = useCookies()
const tokenName = "admin-token"

//  从cookie获取token
export function getToken(){
    return cookie.get(tokenName)
}
//  设置token到cookie
export function setToken(token){
    return cookie.set(tokenName, token)
}
//  清楚cookie中的token
export function removeToken(){
    return cookie.remove(tokenName)
}