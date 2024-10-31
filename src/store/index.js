import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from '@/store/modules/tagsView'
import permission from "@/store/modules/permission";
import websocket from "@/store/modules/websocket";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    tagsView,
    permission,
    websocket
  },
  getters
})

export default store
