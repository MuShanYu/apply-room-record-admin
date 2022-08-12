<template>
  <div class="dashboard-container">
    用户可以看到：<el-button v-permission="['user']" type="primary">主要按钮</el-button>
    管理员可以看到：<el-button v-permission="['admin']" type="primary">主要按钮</el-button>
    超级管理员可以看到：<el-button v-permission="['super-admin']" type="primary">主要按钮</el-button>
  </div>
</template>

<script>
import permission from '@/directive/permission'
export default {
  name: 'Dashboard',
  directives: {
    permission
  },
  computed: {

  },
  data() {
    return {

    }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
