<template>
  <div style="padding: 15px;">
    <div>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-input
            placeholder="请输入角色描述"
            v-model="query.roleDes"
            clearable>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button @click="getDataList" icon="el-icon-search" type="primary">搜索
          </el-button>
          <el-button @click="addDialog = true" icon="el-icon-plus" type="primary" style="margin-left: 15px;">添加
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px;">
      <el-table
        :key="'1'"
        v-loading="listLoading"
        :data="roleList"
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
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelRole(scope.row)"
            >删除
            </el-button>
            <el-dropdown style="margin-left: 10px;" size="mini"
                         @command="(command) => handleCommand(command, scope.row)">
              <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="handleUpdateMenuAuth" icon="el-icon-circle-check">菜单权限</el-dropdown-item>
                <el-dropdown-item command="handleAuthUser" icon="el-icon-user">分配用户</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加菜单" :visible.sync="addDialog" append-to-body center>
      <add-update-role @clickCancel="addDialog = false" @clickSubmit="handleAddSubmit"/>
    </el-dialog>

    <el-dialog title="修改菜单" :visible.sync="updateDialog" append-to-body center>
      <add-update-role :role="curRole" @clickCancel="updateDialog = false" @clickSubmit="handleUpdateSubmit"/>
    </el-dialog>

    <el-dialog :visible.sync="updateMenuAuthDialog" append-to-body center>
      <div slot="title">
        <div>
          修改菜单权限<span
          style="font-size: 12px;color: #909399;">（仅选中菜单，不选中对应的菜单目录，则侧边栏不展示对应菜单）</span>
        </div>
      </div>
      <update-role-menu-auth @submitClick="handleUpdateMenuAuthSubmit" @cancelClick="updateMenuAuthDialog = false"
                             ref="updateRoleMenu" :menu-tree="menuTree" :selected-menu="selectedMenu"/>
    </el-dialog>

  </div>
</template>

<script>
import {getRoleListApi, updateRoleApi, saveRoleApi, delRoleApi} from "@/api/role";
import {getRoleMenuApi, queryMenuListApi, grantMenuToRoleApi} from "@/api/sys-menu";

import AddUpdateRole from "@/views/authority/role/component/add-update-role.vue";
import UpdateRoleMenuAuth from "@/views/authority/role/component/update-role-menu-auth.vue";

export default {
  name: 'SysRole',
  components: {
    AddUpdateRole,
    UpdateRoleMenuAuth
  },
  data() {
    return {
      query: {
        page: 1,
        size: 25,
        roleDes: ''
      },
      listLoading: false,
      roleList: [],
      addDialog: false,
      updateDialog: false,
      curRole: {},
      updateMenuAuthDialog: false,
      menuTree: [],
      selectedMenu: []
    }
  },
  mounted() {
    this.getDataList()
    queryMenuListApi('').then(res => {
      this.menuTree = res
    })
  },
  methods: {
    getDataList() {
      this.listLoading = true
      getRoleListApi(this.query).then(res => {
        console.log(res);
        this.roleList = res.pageData
        this.listLoading = false
      }).catch(e => this.listLoading = false)
    },
    handleAddSubmit(role) {
      this.addDialog = false
      this.listLoading = true
      saveRoleApi(role).then(res => {
        this.$message.success('保存成功')
        this.listLoading = false
        this.getDataList()
      })
    },
    handleUpdate(row) {
      this.updateDialog = true
      this.curRole = Object.assign({}, row)
    },
    handleUpdateSubmit(role) {
      this.updateDialog = false
      this.listLoading = true
      updateRoleApi(role).then(res => {
        this.$message.success('修改成功')
        this.listLoading = false
        this.getDataList()
      })
    },
    handleDelRole(row) {
      this.$confirm('确认要删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        delRoleApi(row.id).then(res => {
          this.$message.success('删除成功')
          this.listLoading = false
          this.getDataList()
        }).catch(e => {
          this.listLoading = false
        })
      }).catch(() => {

      })
    },
    handleCommand(command, row) {
      switch (command) {
        case "handleUpdateMenuAuth":
          this.handleUpdateMenuAuth(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    handleUpdateMenuAuth(row) {
      this.curRole = Object.assign({}, row)
      getRoleMenuApi(row.id).then(res => {
        this.selectedMenu = res
        // this.$refs.updateRoleMenu.setCheckedKeys()
        this.updateMenuAuthDialog = true
      })
    },
    handleUpdateMenuAuthSubmit(submitMenuIds) {
      this.updateMenuAuthDialog = false
      this.listLoading = true
      let dto = {
        menuIds: submitMenuIds,
        roleId: this.curRole.id
      }
      grantMenuToRoleApi(dto).then(res => {
        this.$message.success('修改成功')
        this.listLoading = false
      }).catch(e => this.listLoading = false)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
