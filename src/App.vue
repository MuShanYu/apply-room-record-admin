<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth";

export default {
  name: 'App',
  created() {
    if (getToken())
      this.$store.dispatch('websocket/websocketInit')
  },
  beforeDestroy() {
    if (getToken())
      this.$store.dispatch('websocket/websocketCloseGuanBi')
  }
}
</script>
