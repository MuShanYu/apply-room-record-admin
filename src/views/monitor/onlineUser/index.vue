<template>
  <div>
    <div style="padding: 15px;">
      <el-table
        key="1"
        v-loading="listLoading"
        :data="onlineUserList"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column label="学号/工号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.stuNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学院" width="200" align="center">
          <template slot-scope="{row}">
            <span>{{ row.institute }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在线页面数量" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sources.length }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在线设备数量" align="center">
          <template slot-scope="{row}">
            <span>{{ row.equipments.length }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备列表" align="center">
          <template slot-scope="{row}">
            <el-popover
              width="300"
              placement="bottom"
              trigger="click">
              <div>
                <div style="border-bottom: 1px solid #dcdfe6;" v-for="item in row.equipments">
                  {{item}}
                </div>
              </div>
              <el-button type="text" slot="reference">设备列表</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import userApi from '@/api/user'
export default {
  name: 'OnlineUser',
  data() {
    return {
      listLoading: true,
      onlineUserList: []
    }
  },
  mounted() {
    this.$notify({
      title: '提示',
      type: 'warning',
      dangerouslyUseHTMLString: true,
      message: '<span style="color: red;">本页面数据为实时数据，无需手动刷新</span>',
      duration: 5000
    });
    this.getOnlineUserData();
  },
  watch: {
    '$store.getters.channelId'(newVal, oldVal) {
      // 接收到数据变更信息
      this.getOnlineUserData()
    }
  },
  methods: {
    getOnlineUserData() {
      this.listLoading = true
      userApi.getOnlineUserApi().then(res => {
        this.onlineUserList = res
        this.onlineUserList.forEach(item => {
          let equipments = [...new Set(item.sources)];
          this.$set(item, "equipments", equipments)
        })
        this.listLoading = false
      }).catch(e => this.listLoading = false)
    }
  }
}
</script>
