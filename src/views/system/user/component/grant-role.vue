<template>
  <div style="padding: 15px;">
    <div>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input
            placeholder="请输入角色名称"
            v-model="roleQuery.roleDes"
            clearable>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button @click="getDataList" icon="el-icon-search" type="primary">搜索
          </el-button>

          <el-button @click="handleBatchGrant" icon="el-icon-user" type="primary">确认授权
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px;">
      <el-table
        :key="'1'"
        ref="table"
        v-loading="listLoading"
        :data="roleList"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
        @row-click="clickRow"
        style="width: 100%;">
        <el-table-column
          align="center"
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column label="角色标识" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roleDes }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag v-if="row.state === 1 || row.state === 0" :type="row.state === 1 ? 'success' : 'info'">
              {{ row.state === 1 ? "正常" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="roleQuery.page" :limit.sync="roleQuery.size"
                @pagination="getDataList"/>

  </div>
</template>

<script>
import {getRoleListApi, queryRoleByUserIdApi, grantRoleToUserBatchApi} from "@/api/role";

import Pagination from "@/components/Pagination";

export default {
  name: 'GrantRole',
  components: {
    Pagination
  },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  watch: {
    userId: {
      deep: true,
      handler: function (val, oldVal) {
        this.getUserGrantedRole(val)
      }
    }
  },
  data() {
    return {
      roleList: [],
      total: 0,
      listLoading: false,
      roleQuery: {
        page: 1,
        size: 25,
        roleDes: ''
      },
      roleIds: []
    }
  },
  created() {
    this.getDataList()
    this.getUserGrantedRole()
  },
  methods: {
    getDataList() {
      this.listLoading = true
      getRoleListApi(this.roleQuery).then(res => {
        this.roleList = res.pageData
        this.total = res.totalSize
        this.listLoading = false
      }).catch(e => this.listLoading = false)
    },
    getUserGrantedRole() {
      queryRoleByUserIdApi(this.userId).then(res => {
        this.$nextTick(() => {
          // 选中前重置状态
          this.$refs.table.clearSelection();
          let ids = res.map(item => item.id)
          this.roleList.forEach(item => {
            if (ids.includes(item.id)) {
              this.$refs.table.toggleRowSelection(item)
            }
          })
        })
      })
    },
    handleSelectionChange(selection) {
      this.roleIds = selection.map((item) => item.id);
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 保存选中的数据编号
    getRowKey(row) {
      return row.id;
    },
    handleBatchGrant() {
      this.$confirm('确认要授权吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          userId: this.userId,
          roleIds: this.roleIds
        }
        this.listLoading = true
        grantRoleToUserBatchApi(obj).then(res => {
          this.$message.success('授权成功')
          this.listLoading = false
        }).catch(e => this.listLoading = false)
      }).catch(() => {

      })

    }
  }
}
</script>

<style scoped lang="scss">

</style>
