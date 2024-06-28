<template>
  <div style="padding: 15px;">
    <div style="display: flex;">
      <el-input
        style="width: 280px;"
        placeholder="请输入要搜索的学号"
        v-model="query.stuNum"
        clearable>
      </el-input>
      <el-button style="margin-left: 15px;" @click="getDataList" icon="el-icon-search" type="primary">搜索
      </el-button>
      <el-button v-permission="['authority:role:userDistribute']" @click="handleGrantNewUser" icon="el-icon-plus" type="primary" style="margin-left: 15px;">授权新用户
      </el-button>
      <el-button v-permission="['authority:role:cancelUserDistribute']" :disabled="multipleSelection.length === 0" @click="handleBatchCancelGrant" icon="el-icon-close" plain type="danger" style="margin-left: 15px;">批量取消授权
      </el-button>
    </div>
    <div style="margin-top: 15px;">
      <el-table
        key="1"
        v-loading="listLoading"
        :data="userList"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="width: 100%;">
        <el-table-column
          align="center"
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column label="学号/工号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.stuNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学院" align="center">
          <template slot-scope="{row}">
            <span>{{ row.institute }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state === 1 ? 'success' : 'danger'">
              {{ row.state === 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button v-permission="['authority:role:cancelUserDistribute']" @click="handleCancelGrant(row)" v-waves type="primary"
                       size="mini">
              取消授权
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                @pagination="getDataList"/>


  </div>
</template>

<script>
import {queryRoleGrantedUserApi, grantUserRoleApi, cancelRoleGrantApi} from "@/api/role";
import Pagination from "@/components/Pagination";
export default {
  name: 'roleDistributeUser',
  props: {
    roleId: {
      type: String,
      default: ''
    }
  },
  components: {
    Pagination
  },
  watch: {
    roleId: {
      deep: true,
      handler: function (val, oldVal) {
        this.getDataList()
      }
    }
  },
  data() {
    return {
      listLoading: false,
      userList: [],
      query: {
        page: 1,
        size: 20,
        stuNum: ''
      },
      total: 0,
      multipleSelection: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.listLoading = true
      queryRoleGrantedUserApi(this.roleId, this.query).then(res => {
        this.userList = res.pageData;
        this.total = res.totalSize
        this.listLoading = false
      })
    },
    handleGrantNewUser() {
      this.$prompt('请输入用户学号/工号', '授权角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d{6,16}$/,
        inputErrorMessage: '学号/工号的长度在6~16位'
      }).then(({ value }) => {
        grantUserRoleApi(value, this.roleId).then(res => {
          this.$message({
            type: 'success',
            message: '授权成功'
          });
          this.getDataList()
        })
      }).catch(() => {

      });
    },
    handleCancelGrant(row) {
      this.$confirm('确认要取消授权吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let userIds = []
        userIds.push(row.id)
        let obj = {
          roleId: this.roleId,
          userIds: userIds
        }
        cancelRoleGrantApi(obj).then(res => {
          this.$message.success('取消授权成功')
          this.getDataList()
        })
      }).catch(() => {

      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleBatchCancelGrant() {
      this.$confirm('确认要取消授权吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let userIds = this.multipleSelection.map(item => item.id)
        let obj = {
          roleId: this.roleId,
          userIds: userIds
        }
        cancelRoleGrantApi(obj).then(res => {
          this.$message.success('取消授权成功')
          this.getDataList()
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
