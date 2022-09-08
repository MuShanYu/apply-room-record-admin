import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasGetUserInfo = store.getters.userInfo
  if (!hasGetUserInfo && whiteList.indexOf(to.path) === -1) {
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
