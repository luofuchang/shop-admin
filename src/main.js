import { createApp } from 'vue'
import App from '~/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { router } from '~/router'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "~/permission"
import "nprogress/nprogress.css"
import permission from '~/directive/permission'
import 'virtual:windi.css'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store)
app.use(router)
app.use(ElementPlus)
app.use(permission)

app.mount('#app')