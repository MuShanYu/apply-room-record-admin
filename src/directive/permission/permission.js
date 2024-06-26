import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const permissions = store.getters.permissions
  console.log(permissions);
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const assignPermission = value
      const hasPermission = permissions.some(p => {
        return assignPermission.includes(p)
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['system:notice:add']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
