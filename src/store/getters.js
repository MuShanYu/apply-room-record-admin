const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  channelId: state => state.app.channelId,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permissionRoutes: state => state.permission.routes,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  webSocketIsOpen: state => state.websocket.webSocketIsOpen
}
export default getters
