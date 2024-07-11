<template>
  <div class="app-container">
    <div :style="fixedHeader ? 'margin-top: 35px;' : ''" class="filter-container" style="display: flex;">
      <el-select clearable @change="getUserList" style="margin-right: 10px;" v-model="query.institute"
                 placeholder="请选择学院">
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
      <el-button class="filter-item" v-permission="['system:user:import']" @click="$router.push('/data-import/user')" v-waves style="margin-left: 10px;"
                 type="primary" icon="el-icon-upload2">
        导入
      </el-button>
      <el-link :href="config.userExcelHref" v-permission="['system:user:downloadTemplate']" style="margin-left: 18px;"
               :underline="false" type="primary">
        导入模板下载 <i class="el-icon-download"></i>
      </el-link>
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
        <el-table-column label="注册日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column width="250" label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button v-permission="['system:user:accessRecord']" icon="el-icon-position" @click="handleUserAccessRecordClick(row, $index)" type="primary"
                       size="mini">
              足迹详情
            </el-button>
            <el-button v-permission="['system:user:reserveDetail']" icon="el-icon-time" @click="handleReserveDetailClick(row, $index)" style="margin-left: 10px;" type="primary"
                       size="mini">
              预约详情
            </el-button>
            <el-dropdown style="margin-left: 10px;" size="mini"
                         @command="(command) => handleCommand(command, row)">
              <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-permission="['system:user:update']" command="handleUpdateUserInfo" icon="el-icon-edit">修改信息</el-dropdown-item>
                <el-dropdown-item v-permission="['system:user:resetPwd']" command="handleResetPwd" icon="el-icon-unlock">重置密码</el-dropdown-item>
                <el-dropdown-item v-permission="['system:user:distributeRole']" command="handleGrantRoleClick" icon="el-icon-user">分配角色</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
      <user-room-reserve :id="reserveUserId"/>
    </el-drawer>

    <el-drawer
      size="100%"
      title="足迹详情"
      :show-close="true"
      :visible.sync="accessRecordDrawer"
      direction="rtl">
      <user-access-record :id="recordUserId"/>
    </el-drawer>

    <el-dialog center :visible.sync="updateDialog" title="修改用户信息">
      <update-info :user="currentUser" @submitClick="handleUserUpdate" @cancelClick="updateDialog = false"/>
    </el-dialog>

    <el-drawer
      title="分配角色"
      size="60%"
      :visible.sync="drawer"
      direction="rtl">
        <grant-role :user-id="currentUser.id" />
    </el-drawer>

  </div>
</template>

<script>
import userApi from "@/api/user";
import dataStatistics from "@/api/data-statistics";
import {resetUserPwdApi, adminUpdateUserInfoApi} from "@/api/user";

import UserRoomReserve from "./component/user-room-reserve";
import UserAccessRecord from "./component/user-access-record";
import Pagination from "@/components/Pagination";
import UpdateInfo from "@/views/system/user/component/update-info.vue";
import GrantRole from "@/views/system/user/component/grant-role.vue";

import config from '@/common/sys-config'
import {mapState} from "vuex";

export default {
  name: "UserManager",
  components: {
    Pagination,
    UserRoomReserve,
    UserAccessRecord,
    UpdateInfo,
    GrantRole
  },
  computed: {
    config() {
      return config;
    },
    ...mapState({
      token: state => state.user.token,
      roles: state => state.user.roles,
      fixedHeader: state => state.settings.fixedHeader
    }),
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
      roleIds: [],
      currentUser: {},
      dialogFormVisible: false,
      institute: [],
      reservationDrawer: false,
      accessRecordDrawer: false,
      recordUserId: '',
      reserveUserId: '',
      updateDialog: false,
      drawer: false,

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
        // console.sysOperateLog(this.userList);
      }).catch(e => {
        this.listLoading = false
      })
    },
    async getInstitute() {
      let data = await dataStatistics.getInstituteClassifyInfo();
      this.institute = data.institutes;
    },
    handleReserveDetailClick(row, index) {
      this.reserveUserId = row.id
      this.reservationDrawer = true
    },
    handleUserAccessRecordClick(row, index) {
      this.recordUserId = row.id
      this.accessRecordDrawer = true
    },
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleUpdateUserInfo":
          this.handleUpdateUserInfo(row);
          break;
        case "handleGrantRoleClick":
          this.handleGrantRoleClick(row);
          break;
        default:
          break;
      }
    },
    handleResetPwd(row) {
      this.$prompt('请输入要重置的新密码', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{4,16}$/,
        inputErrorMessage: '密码的长度在4~16位'
      }).then(({ value }) => {
        resetUserPwdApi(row.id, value).then(res => {
          this.$message.success('修改成功')
        })
      }).catch(() => {

      });
    },
    handleUpdateUserInfo(row) {
      this.currentUser = Object.assign({}, row)
      this.updateDialog = true
    },
    handleUserUpdate(user) {
      this.updateDialog = false
      let obj = {
        id: user.id,
        name: user.name,
        institute: user.institute,
        mail: user.mail,
        stuNum: user.stuNum
      }
      this.listLoading = true
      adminUpdateUserInfoApi(obj).then(res => {
        this.$message.success('修改成功')
        this.listLoading = false
        this.getUserList()
      }).catch(e => this.listLoading = false)
    },
    handleGrantRoleClick(row) {
      this.currentUser = Object.assign({}, row)
      this.drawer = true
    }
  }
}
</script>

<style scoped lang="scss">
.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;

  & :hover {
    color: rgb(32, 160, 255);
  }

}
</style>
