<template>
  <div style="padding: 15px;">
    <el-row :gutter="15">
      <el-col :span="6">
        <el-input
          placeholder="请输入搜索的菜单名称"
          v-model="queryMenuName"
          clearable>
        </el-input>
      </el-col>
      <el-col :span="18">
        <el-button @click="getTreeSelect" icon="el-icon-search" type="primary">搜索
        </el-button>
        <el-button @click="open = true" icon="el-icon-plus" type="primary" style="margin-left: 15px;">添加
        </el-button>
        <el-button @click="handleExpandAll" style="margin-left: 15px;" icon="el-icon-folder">展开/折叠
        </el-button>
        <span style="font-size: 12px;color: #909399;margin-left: 15px;">目录下的菜单数量为1时默认显示跟路由</span>
      </el-col>
    </el-row>
    <div style="margin-top: 15px;">
      <el-table
        v-if="refreshTable"
        ref="dataTable"
        :default-expand-all="expandAll"
        v-loading="listLoading"
        :data="menuTree"
        style="width: 100%"
        row-key="id"
        highlight-current-row
        :tree-props="{children: 'children'}">
        <el-table-column align="center" prop="title" label="菜单名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序" width="60"></el-table-column>
        <el-table-column align="center" prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" prop="state" label="类型" width="80">
          <template slot-scope="{ row }">
            <el-tag type="primary">
              {{row.menuType | messageTypeFilter}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDel(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加菜单" :visible.sync="open" append-to-body>
      <add-or-update-form ref="addUpdateForm" @submit="handleSubmit" :key="1" @close="open = false" :menu-options="menuOptions" />
    </el-dialog>

    <el-dialog title="修改菜单" :visible.sync="updateDialog" append-to-body>
      <add-or-update-form @submit="handleUpdateSubmit" ref="addUpdateForm" :key="2" :form="curMenu" @close="updateDialog = false" :menu-options="menuOptions" />
    </el-dialog>
  </div>
</template>

<script>
import {queryMenuListApi, saveMenuApi, updateMenuApi, delMenuApi} from "@/api/sys-menu";

import AddOrUpdateForm from "./component/add-or-update-form.vue";
import Pagination from "@/components/Pagination";

export default {
  name: 'SysMenu',
  components: {
    AddOrUpdateForm,
    Pagination
  },
  data() {
    return {
      queryMenuName: '',
      menuTree:[],
      open: false,
      menuOptions: [],
      listLoading: false,
      expandAll: false,
      refreshTable: true,
      updateDialog: false,
      curMenu: null
    }
  },
  mounted() {
    this.getTreeSelect()
  },
  filters: {
    messageTypeFilter(type) {
      switch (type) {
        case 0:
          return '目录';
        case 1:
          return '菜单';
        case 2:
          return '按钮'
      }
    }
  },
  methods: {
    /** 查询菜单下拉树结构 */
    getTreeSelect() {
      this.listLoading = true
      queryMenuListApi(this.queryMenuName).then(res => {
        this.menuTree = res || []
        this.menuOptions = []
        const menu = { id: '0', title: '主类目', children: [] };
        menu.children = res
        this.menuOptions.push(menu);
        this.listLoading = false
      }).catch(e => {this.listLoading = false})
    },
    handleSubmit(menu) {
      this.open = false
      this.listLoading = true
      saveMenuApi(menu).then(res => {
        this.$message.success('保存成功')
        this.$refs.addUpdateForm.resetAttr()
        this.listLoading = false
        this.getTreeSelect()
      }).catch(e => {this.listLoading = false})
    },
    handleUpdateSubmit(menu) {
      this.updateDialog = false
      this.listLoading = true
      updateMenuApi(menu).then(res => {
        this.$message.success('修改成功')
        this.listLoading = false
        this.getTreeSelect()
      }).catch(e => {this.listLoading = false})
    },
    handleExpandAll() {
      this.refreshTable = false;
      this.expandAll = !this.expandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    handleUpdate(row) {
      this.curMenu = Object.assign({}, row)
      this.updateDialog = true
    },
    handleDel(row) {
      this.$confirm('确认要删除该菜单吗？也将删除角色对应菜单权限。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        delMenuApi(row.id).then(res => {
          this.$message.success('删除成功')
          this.listLoading = false
          this.getTreeSelect()
        }).catch(e => {this.listLoading = false})
      }).catch(() => {

      })

    },
  }
}
</script>

<style scoped lang="scss">

</style>
