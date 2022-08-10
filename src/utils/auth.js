import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserInfo(user) {
  let userInfo = '';
  if (user) {
    userInfo = JSON.stringify(user)
  }
  return Cookies.set('userInfo', userInfo, { expires: 7 })
}

export function getUserInfo() {
  let userInfoText = Cookies.get('userInfo')
  if (userInfoText) {
    return JSON.parse(userInfoText)
  }
  return '';
}

export function removeUserInfo() {
  return Cookies.remove('userInfo')
}
