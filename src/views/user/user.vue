<template>
  <div style="margin: 10px;">
    <div style="margin-bottom: 10px;">
      <el-select clearable @change="getUserList" style="margin-right: 10px;" v-model="query.institute" placeholder="请选择学院">
        <el-option
          v-for="(item, index) in institute"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-input v-model="query.name"
                clearable
                @clear="getUserList"
                placeholder="请输入检索的姓名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="getUserList"/>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search"
                 @click="getUserList">
        搜索
      </el-button>
    </div>
    <div>
      <el-table
        key="1"
        v-loading="listLoading"
        :data="userList"
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
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学院" align="center">
          <template slot-scope="{row}">
            <span>{{ row.institute }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="{row}">
            <span>{{ row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限" width="200" align="center">
          <template slot-scope="{row}">
            <span v-if="row.roleList.length === 0">未赋予角色</span>
            <el-tag v-else style="margin: 3px;" v-for="item in row.roleList" :key="item.id" type="primary">
              {{ item.roleDes }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button @click="handleUserAccessRecordClick(row, $index)" v-waves style="margin: 3px;" type="primary" size="mini">
              足迹详情
            </el-button>
            <el-button @click="handleReserveDetailClick(row, $index)" v-waves style="margin: 3px;" type="primary" size="mini">
              预约详情
            </el-button>
            <el-button plain type="primary" @click="handleUpdateRoleClick(row, $index)" v-waves
                       v-permission="['super-admin']" style="margin: 3px;" size="mini">
              权限修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getUserList"/>
    </div>

    <el-drawer
      size="100%"
      title="预约详情"
      :show-close="true"
      :visible.sync="reservationDrawer"
      direction="rtl">
      <user-room-reserve :id="reserveUserId" />
    </el-drawer>

    <el-drawer
      size="100%"
      title="足迹详情"
      :show-close="true"
      :visible.sync="accessRecordDrawer"
      direction="rtl">
      <user-access-record :id="recordUserId" />
    </el-drawer>

    <el-dialog @close="resetUpdateTempData" :close-on-click-modal="false" :center="true"
               :visible.sync="dialogFormVisible" title="修改权限">
      <div style="text-align: center;">
        <el-checkbox-group v-model="roleIds">
          <el-checkbox :disabled="item.id === '0'" v-for="(item, index) in roleOptions" :label="item.id"
                       :key="index">
            {{ item.roleDes }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-right: 10px;" v-waves @click="dialogFormVisible = false">取消</el-button>
        <el-button @click="updateRole" v-waves type="primary">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import userApi from "@/api/user";
import dataStatistics from "@/api/data-statistics";

import UserRoomReserve from "@/views/user/component/user-room-reserve";
import UserAccessRecord from "@/views/user/component/user-access-record";
import Pagination from "@/components/Pagination";

export default {
  name: "User",
  components: {
    Pagination,
    UserRoomReserve,
    UserAccessRecord
  },
  data() {
    return {
      query: {
        page: 1,
        size: 10,
        name: '',
        institute: ''
      },
      listLoading: false,
      userList: [],
      total: 0,
      roleOptions: [
        {
          roleDes: '普通用户',
          roleName: 'user',
          id: '0'
        },
        {
          roleDes: '管理员',
          roleName: 'admin',
          id: '1'
        },
        {
          roleDes: '超级管理员',
          roleName: 'super-admin',
          id: '2'
        }
      ],
      roleIds: [],
      currentUser: {},
      dialogFormVisible: false,
      institute: [],
      reservationDrawer: false,
      accessRecordDrawer: false,
      recordUserId: '',
      reserveUserId: ''
    }
  },
  created() {
    this.getUserList()
    this.getInstitute()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      userApi.userList(this.query).then(data => {
        this.userList = data.pageData
        this.total = data.totalSize
        this.listLoading = false
        // console.log(this.userList);
      }).catch(e => {
        this.listLoading = false
      })
    },
    async getInstitute() {
      let data = await dataStatistics.getInstituteClassifyInfo();
      this.institute = data.institutes;
    },
    resetUpdateTempData() {
      this.currentUser = {}
      this.roleIds = []
    },
    handleUpdateRoleClick(row, index) {
      this.currentUser = Object.assign({}, row)
      this.currentUser.roleList.forEach(item => this.roleIds.push(item.id))
      this.dialogFormVisible = true
    },
    updateRole() {
      let that = this
      console.log(this.currentUser);
      userApi.changeRole({
        userId: that.currentUser.id,
        roleIds: that.roleIds
      }).then(res => {
        let userIndex = this.userList.findIndex(value => value.id === this.currentUser.id)
        this.userList[userIndex].roleList.splice(0, this.userList[userIndex].roleList.length)
        this.roleIds.forEach(val => {
          let role = this.roleOptions.find(item => item.id === val)
          this.userList[userIndex].roleList.push(role);
        })
        this.resetUpdateTempData()
        this.dialogFormVisible = false
        this.$notify({
          title: '系统提示',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      }).catch(e => {
        this.dialogFormVisible = false
      })
    },
    handleReserveDetailClick(row, index) {
      this.reserveUserId = row.id
      this.reservationDrawer = true
    },
    handleUserAccessRecordClick(row, index) {
      this.recordUserId = row.id
      this.accessRecordDrawer = true
    }
  }
}
</script>

<style scoped>

</style>
