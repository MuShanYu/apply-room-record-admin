import {Message} from 'element-ui'

let websocket = null
let messageCallback = null
let errorCallback = null
let wsUrl = ''
let tryTime = 0

// 接收ws后端返回的数据
function onWebsocketMsg(e) {
  messageCallback(e.data)
}

/**
 * 发起websocket连接
 * @param {Object} agentData 需要向后台传递的参数数据
 */
function websocketSend(agentData) {
  // 加延迟是为了尽量让ws连接状态变为OPEN
  setTimeout(() => {
    // 添加状态判断，当为OPEN时，发送消息
    if (websocket.readyState === websocket.OPEN) { // websocket.OPEN = 1
      // 发给后端的数据需要字符串化
      websocket.send(agentData)
    }
    if (websocket.readyState === websocket.CLOSED) { // websocket.CLOSED = 3
      console.log('websocket.readyState=3')
      Message.error('ws连接异常，请稍候重试')
      errorCallback()
    }
  }, 500)
}

// 关闭ws连接
function onWebsocketClose(e) {
  // e.code === 1005  表示正常关闭。 无论为何目的而创建, 该链接都已成功完成任务。
  // e.code !== 1005  表示非正常关闭。
  if (e && e.code !== 1005) {
    Message.warning('ws连接异常，正在尝试重新连接，第' + (tryTime + 1) + '次重连')
    errorCallback()
    // // 如果需要设置异常重连则可替换为下面的代码，自行进行测试
    if (tryTime < 3) {
      setTimeout(function () {
        websocket = null
        tryTime++
        initWebSocket()
      }, 3 * 1000)
    } else {
      Message.error('重连失败！请稍后重试')
    }
  }
}

// 建立ws连接
function onWebsocketOpen(e) {
  tryTime = 0
  websocketSend(e)
}

// 初始化websocket
function initWebSocket() {
  if (typeof (WebSocket) === 'undefined') {
    Message.error('您的浏览器不支持WebSocket，无法获取数据')
    return false
  }
  websocket = new WebSocket(wsUrl)
  websocket.onmessage = function (e) {
    onWebsocketMsg(e)
  }
  websocket.onopen = function () {
    onWebsocketOpen(navigator.userAgent)
  }
  websocket.onerror = function () {
    errorCallback()
  }
  websocket.onclose = function (e) {
    onWebsocketClose(e)
  }
}

/**
 * 发起websocket请求函数
 * @param {string} url ws连接地址
 * @param {Object} agentData 传给后台的参数
 * @param {function} successCallback 接收到ws数据，对数据进行处理的回调函数
 * @param {function} errCallback ws连接错误的回调函数
 */
export function sendWebsocket(url, agentData, successCallback, errCallback) {
  wsUrl = url
  initWebSocket()
  messageCallback = successCallback
  errorCallback = errCallback
}

/**
 * 关闭websocket函数
 */
export function closeWebsocket() {
  if (websocket) {
    websocket.close() // 关闭websocket
  }
}
