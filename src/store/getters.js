const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  channelId: state => state.app.channelId,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
}
export default getters
