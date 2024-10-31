import sysConfig from "@/common/sys-config";
import {getToken} from '@/utils/auth'
import Bowser from 'bowser'

const MAX_RECONNECT_ATTEMPTS = 5; // 最大重连次数
const socketData = {
  namespaced: true,
  state: {
    socketTask: null, //socket实例

    websocketData: {}, // 存放从后端接收到的websocket数据

    webSocketPingTimer: null, // 心跳定时器

    webSocketPingTime: 5000, // 心跳的间隔，当前为 10秒,

    webSocketReconnectCount: 1, // 重连次数

    webSocketIsReconnect: true, // 是否重连

    webSocketIsOpen: true, //链接是否在打开
  },

  mutations: {
    setSockTask(state, data) {
      state.socketTask = data;
    },

    setWebsocketData(state, data) {
      state.websocketData = data;
    },
    setReconnectCount(state, count) {
      state.webSocketReconnectCount = count;
    },
    setIsOpen(state, data) {
      state.webSocketIsOpen = data;
    },
  },

  actions: {
    // 这里可以改造成讲message作为参数传递，在open里面传递，没必要写在on open函数里面
    websocketInit({state, dispatch, commit}) {
      let socketTask = new WebSocket(`${sysConfig.websocketPath}?token=${getToken()}&platform=web`);
      // 正确设置事件处理器
      socketTask.onopen = () => dispatch("websocketOnOpen");
      socketTask.onmessage = (res) => dispatch("websocketOnMessage", res);
      socketTask.onclose = (e) => dispatch("websocketOnClose");
      socketTask.onerror = (e) => dispatch("websocketOnError");
      commit("setSockTask", socketTask);  // 设置 state 中的 socketTask
    },
    websocketOnOpen({dispatch, commit}) {
      console.log("WebSocket连接正常打开！");
      commit("setIsOpen", true);
      commit("setReconnectCount", 1); // 重置重连计数
      // 发送在线设备信息
      let sendMsg = Bowser.name + Bowser.version + '(' + Bowser.osname + ')'
      dispatch('websocketSend', sendMsg)
      //开始心跳检测
      dispatch("webSocketPing");
    },
    // 发送数据
    websocketSend({state, dispatch}, data) {
      console.log("发送消息：",data);
      state.socketTask.send(data);
    },
    // 收到数据
    websocketOnMessage({commit, dispatch}, res) {
      // 修改状态为未连接
      //接到推送的消息--显示全局弹窗
      console.log("收到服务器内容：" + res.data)
      if (res.data !== 'pong') // 如果不是心跳消息，处理消息逻辑
        dispatch('app/connectSocketChannel', res.data, {root: true})
    },
    websocketOnClose({state, commit, dispatch}) {
      //链接关闭执行
      // dispatch('webSocketClose')
      console.log("websocketOnClose连接关闭");
      commit("setIsOpen", false);
      clearTimeout(state.webSocketPingTimer); // 清理心跳定时器
      state.socketTask = null;
    },

    websocketOnError({commit, dispatch}) {
      //链接关闭执行
      dispatch("webSocketClose");
      console.log("websocketOnError连接错误");
    },
    // 定时心跳告诉服务器自己还活着，防止丢包
    webSocketPing({ state, dispatch }) {
      if (getToken() && state.webSocketIsOpen) {
        state.webSocketPingTimer = setTimeout(() => {
          console.log("发送心跳");
          dispatch("websocketSend", "ping");
          clearTimeout(state.webSocketPingTimer); // 清理当前心跳定时器
          dispatch("webSocketPing"); // 重新开始心跳
        }, state.webSocketPingTime);
      }
    },
    webSocketClose({ state, dispatch, commit }) {
      if (getToken()) {
        commit("setIsOpen", false);
        clearTimeout(state.webSocketPingTimer); // 清理心跳定时器
        state.socketTask = null;
        if (state.webSocketIsReconnect && state.webSocketReconnectCount <= MAX_RECONNECT_ATTEMPTS) {
          dispatch("webSocketReconnect");
        } else {
          console.log("超过最大重连次数，停止重连");
        }
      }
    },
    webSocketReconnect({ state, dispatch, commit }) {
      if (getToken() && !state.webSocketIsOpen && state.webSocketReconnectCount <= MAX_RECONNECT_ATTEMPTS) {
        console.log(`第 ${state.webSocketReconnectCount} 次重连`);
        commit("setReconnectCount", state.webSocketReconnectCount + 1);
        dispatch("websocketInit"); // 尝试重连
        // 5秒后检查是否重连成功，否则继续尝试
        setTimeout(() => {
          if (!state.webSocketIsOpen && state.webSocketReconnectCount <= MAX_RECONNECT_ATTEMPTS) {
            dispatch("webSocketReconnect");
          }
        }, 5000);
      }
    },
    //关闭websocket
    websocketCloseGuanBi({state}) {
      if (!state.socketTask) return;
      state.socketTask.close();
    }
  },
};

export default socketData;
