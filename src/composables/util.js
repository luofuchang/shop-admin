import { ElNotification } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import nProgress from 'nprogress'

//  自定义统一通知
export function myNotification(message, type = "success", dangerouslyUseHTMLString = true) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 3000
  })
}

// 自定义消息弹框
export function myMessageBox(message, type = "warning", title = "") {
  return ElMessageBox.confirm(
    message,
    title,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type,
    }
  )
}

// 显示全屏
export function showFullLoading(){
  nProgress.start()
}

// 隐藏全屏
export function hideFullLoading(){
  nProgress.done()
}


// 弹出输入框
export function showPrompt(tip, value) {
  return ElMessageBox.prompt(tip, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value
  })
}

// query参数转化
export function queryParamToUrl(query) {
  let q = []
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`)
    }
  }
  let r = q.join("&")
  r = r ? ("?" + r) : ""
  return r
}