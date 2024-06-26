<template>
  <div class="app-container">
    <div style="display: flex;justify-content: flex-start;background-color: #ffffff;padding: 15px;"
         :style="fixedHeader ? 'margin-top: 35px;' : ''">
      <div id="room-list-add">
        <el-button style="margin-right: 10px;" v-permission="['system:room:add']" @click="addRoomDrawer = true" v-waves
                   type="primary" icon="el-icon-plus">
          添加
        </el-button>
      </div>
      <div id="room-list-operate-apply" style="margin-right: 10px;">
        <el-button v-permission="['system:room:disableReserveAndRollBack']" @click="handleBatchDisableReserve" v-waves type="info"
                   icon="el-icon-document-delete">
          禁止预约/解除
        </el-button>
      </div>
      <div id="room-list-operate-ban">
        <el-button @click="handleBatchDisableRoom" v-waves
                   type="danger"
                   v-permission="['system:room:disableAndRollBack']"
                   icon="el-icon-circle-close">
          批量禁用/解除
        </el-button>
      </div>
      <div id="room-list-select-filter" style="display: flex;margin-right: 10px;margin-left: 10px;">
        <el-select clearable @change="getRoomList"
                   v-model="query.school" placeholder="请选择校区">
          <el-option
            v-for="(item, index) in school"
            :label="item"
            :key="index"
            :value="item">
          </el-option>
        </el-select>
        <el-select clearable @change="getRoomList" style="margin-right: 10px;margin-left: 10px;"
                   v-model="query.teachBuilding" placeholder="请选择楼栋">
          <el-option
            v-for="(item, index) in teachBuilding"
            :label="item"
            :key="index"
            :value="item">
          </el-option>
        </el-select>
        <el-select clearable @change="getRoomList"
                   v-model="query.category" placeholder="请选择类别">
          <el-option
            v-for="(item, index) in category"
            :label="item"
            :key="index"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div id="room-list-room-name" style="display: flex;">
        <el-input v-model="query.roomName"
                  clearable
                  @clear="getRoomList"
                  placeholder="请输入检索的房间名称" style="width: 200px;"
                  @keyup.enter.native="getRoomList"/>
        <el-button v-permission="['system:room:search']" v-waves style="margin-left: 10px;" type="primary" icon="el-icon-search"
                   @click="getRoomList">
          搜索
        </el-button>
      </div>
    </div>
    <div class="oper-2">
      <el-button id="room-list-operate-qr-code" v-permission="['system:room:generateQRCode']" @click="handleBatchDownloadQRCode"
                 v-waves type="primary" icon="el-icon-picture-outline">
        生成房间二维码
      </el-button>
      <div id="room-list-import" style="display: flex;margin-left: 10px;">
        <el-button v-permission="['system:room:import']" @click="$router.push('/data-import/room')"
                   v-waves type="primary" icon="el-icon-upload2">
          导入
        </el-button>
        <el-link :href="config.roomExcelHref" v-permission="['system:room:downloadTemplate']" style="margin-left: 15px;"
                 :underline="false" type="primary">
          导入模板下载 <i class="el-icon-download"></i>
        </el-link>
      </div>
    </div>
    <div>
      <el-table
        :key="'1'"
        v-loading="listLoading"
        :data="roomList"
        border
        fit
        empty-text="暂无您负责的房间(点击负责人列右方图标查看所有房间)"
        @selection-change="handleSelectionChange"
        highlight-current-row
        style="width: 100%;">
        <el-table-column
          align="center"
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column label="校区" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.school }}</span>
          </template>
        </el-table-column>
        <el-table-column label="楼栋" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.teachBuilding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roomName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备信息" align="center">
          <template slot-scope="{row}">
            <span>{{ row.equipmentInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="容量" width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.capacity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类别" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="93" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state | stateTagFilter">
              {{ row.state | roomStateFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <template slot="header">
            <div id="room-list-my-charge">
              <span style="margin-right: 4px;">负责人</span>
              <el-tooltip v-if="isSuperAdmin" effect="light"
                          :content="eyeIcon === 'eye' ? '点击查看所有房间' : '点击查看您负责的房间'" placement="top">
                <svg-icon @click.stop="getMyChargeRoom" class="link-type" :icon-class="eyeIcon"/>
              </el-tooltip>
            </div>
          </template>
          <template slot-scope="{row}">
            <span>{{ row.chargePerson }}</span>
          </template>
        </el-table-column>
        <el-table-column width="250" label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button @click="handleRoomReservationClick(row, $index)" icon="el-icon-time" type="primary" size="mini">
              预约详情
            </el-button>
            <el-button @click="handleRoomAttendanceClick(row, $index)" icon="el-icon-date" style="margin-left: 10px;" type="primary" size="mini">
              签到详情
            </el-button>

            <el-dropdown style="margin-left: 10px;" size="mini"
                         @command="(command) => handleCommand(command, row)">
              <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="handleAccessRecordClick" icon="el-icon-position">足迹详情</el-dropdown-item>
                <el-dropdown-item command="handleRoomUpdateClick" icon="el-icon-edit">修改</el-dropdown-item>
                <el-dropdown-item command="handleDisableClick" icon="el-icon-delete">{{ row.state === 2 ? '解除' : '禁用' }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getRoomList"/>
    </div>

    <el-dialog
      :center="true"
      title="批量生成房间二维码预览"
      :fullscreen="true"
      :visible.sync="generateQRCodeDialog">
      <room-qr-code-generate :room-list="roomSelectedList"/>
    </el-dialog>

    <!-- 查看预约详情 -->
    <el-drawer
      size="70%"
      title="预约详情"
      :show-close="false"
      :visible.sync="reservationDrawer"
      direction="rtl">
      <room-reservation-list :room-id="currentRoomId"/>
    </el-drawer>

    <el-drawer
      size="50%"
      title="修改房间"
      :show-close="false"
      :visible.sync="updateRoomDrawer"
      direction="rtl">
      <room-update @cancelUpdate="updateRoomDrawer = false"
                   @updateSuccess="updateRoomSuccessHandler"
                   :room="currentRoom"/>
    </el-drawer>

    <el-drawer
      size="50%"
      title="添加房间"
      :show-close="false"
      :visible.sync="addRoomDrawer"
      direction="rtl">
      <room-add @cancelUpdate="addRoomDrawer = false"
                @addSuccess="addRoomSuccessHandler"/>
    </el-drawer>

    <el-drawer
      size="80%"
      title="足迹详情"
      :show-close="false"
      :visible.sync="accessRecordDrawer"
      direction="rtl">
      <room-access-record-list :room-id="currentRoomId"/>
    </el-drawer>

    <el-drawer
      size="65%"
      title="签到详情"
      :show-close="false"
      :visible.sync="accessAttendanceDrawer"
      direction="rtl">
      <room-attendance-list :room-id="currentRoomId"/>
    </el-drawer>

  </div>
</template>

<script>
import roomApi from '@/api/room'
import dataStatistics from "@/api/data-statistics";

import Pagination from "@/components/Pagination";
import RoomReservationList from "./component/room-reservation-list";
import RoomUpdate from "./component/room-update";
import RoomAdd from "./component/room-add";
import RoomAccessRecordList from "./component/room-access-record-list";
import RoomQrCodeGenerate from "./component/room-qr-code-generate";
import RoomAttendanceList from "./component/room-attendance-list";

import clipboard from '@/directive/clipboard/index.js'
import {mapState} from "vuex"; // use clipboard by v-directive
import config from "@/common/sys-config";

export default {
  name: "RoomList",
  directives: {
    clipboard
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      roles: state => state.user.roles,
      fixedHeader: state => state.settings.fixedHeader
    }),
    config() {
      return config;
    }
  },
  filters: {
    roomStateFilter(state) {
      switch (state) {
        case 0:
          return '禁止预约'
        case 1:
          return '可预约'
        case 2:
          return '禁用'
      }
    },
    stateTagFilter(state) {
      switch (state) {
        case 0:
          return 'info'
        case 1:
          return 'success'
        case 2:
          return 'danger'
      }
    }
  },
  components: {
    Pagination,
    RoomReservationList,
    RoomUpdate,
    RoomAdd,
    RoomAttendanceList,
    RoomAccessRecordList,
    RoomQrCodeGenerate
  },
  data() {
    return {
      // 查询相关参数
      query: {
        page: 1,
        size: 10,
        teachBuilding: '',
        school: '',
        category: '',
        roomName: '',
        chargePersonId: null
      },
      listLoading: false,
      detailListLoading: false,
      roomList: [],
      roomReservationList: [],
      total: 0,
      roomReservationTotal: 0,
      teachBuilding: [],
      school: [],
      category: [],
      // 操作相关参数
      currentRoom: {},
      reservationDrawer: false,
      updateRoomDrawer: false,
      addRoomDrawer: false,
      currentRoomId: '',
      accessRecordDrawer: false,
      accessAttendanceDrawer: false,
      currentUserId: '',
      isSuperAdmin: false,
      roomSelectedList: [],
      generateQRCodeDialog: false,
      eyeIcon: 'eye'
    }
  },
  created() {
    this.currentUserId = this.userInfo.id
    this.query.chargePersonId = this.userInfo.id
    this.isSuperAdmin = this.roles.some(v => v === 'super-admin')
    this.getRoomList()
    this.getRoomClassifyInfo()
  },
  methods: {
    getRoomList() {
      this.listLoading = true
      roomApi.roomList(this.query).then(data => {
        this.roomList = data.pageData
        this.total = data.totalSize
        this.listLoading = false
        // console.sysOperateLog(this.roomList);
      }).catch(e => {
        this.listLoading = false
      })
    },
    getRoomClassifyInfo() {
      dataStatistics.getRoomClassifyInfo().then(data => {
        this.category = data.categories
        this.school = data.schools
        this.teachBuilding = data.teachBuildings
      })
    },
    handleRoomReservationClick(row, index) {
      this.currentRoomId = row.id
      this.reservationDrawer = true
    },
    handleRoomUpdateClick(item) {
      this.currentRoom = Object.assign({}, item)
      this.updateRoomDrawer = true
    },
    updateRoomSuccessHandler(room) {
      let roomIndex = this.roomList.findIndex(item => item.id === room.id)
      this.roomList.splice(roomIndex, 1, room);
      this.updateRoomDrawer = false
    },
    handleDisableClick(room) {
      let text = room.state === 1 ? '确定要禁用该房间吗?' : '确定要解除禁用该房间吗?'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.info('正在完成操作，请您耐心等待')
        roomApi.disableRoom(room.id).then(() => {
          if (room.state === 2) {
            room.state = 1
            this.$message.success("解除禁用成功")
          } else {
            room.state = 2
            this.$message.success("禁用成功")
          }
        })
      }).catch(() => {

      })
    },
    addRoomSuccessHandler(room) {
      this.roomList.push(room)
      this.addRoomDrawer = false
    },
    handleAccessRecordClick(row) {
      this.currentRoomId = row.id
      this.accessRecordDrawer = true
    },
    handleRoomAttendanceClick(row, index) {
      this.currentRoomId = row.id
      this.accessAttendanceDrawer = true
    },
    handleSelectionChange(selectedVal) {
      this.roomSelectedList = selectedVal;
    },
    handleBatchDownloadQRCode() {
      if (this.roomSelectedList.length === 0) {
        this.$message.error("请选择要生成二维码的房间");
        return
      }
      this.generateQRCodeDialog = true
    },
    async handleBatchDisableReserve() {
      if (this.roomSelectedList.length === 0) {
        this.$message.error('未选择要禁止预约的房间')
        return
      }
      // 当前房间是不是我负责的，我是不是超级管理员
      // 超级管理员不做限制
      if (!this.isSuperAdmin) {
        // 当前房间是不是我负责的，否则没有操作权限
        for (let i = 0; i < this.roomSelectedList.length; i++) {
          if (this.roomSelectedList[i].chargePersonId !== this.userInfo.id) {
            // 这个房间不是我负责的
            this.$message.error(this.roomSelectedList[i].roomName + '等，不是您负责的房间，无法完成操作！')
            return
          }
        }
      }
      this.$message.info('正在进行批量操作，请稍等')
      for (let room of this.roomSelectedList) {
        await this.doDisableReserveRoom(room)
      }
    },
    doDisableReserveRoom(room) {
      return new Promise((resolve, reject) => {
        roomApi.disableReserveRoom(room.id).then(() => {
          if (room.state === 0) {
            room.state = 1
            this.$message.success('已解除' + room.roomName + '的禁止预约')
          } else {
            room.state = 0
            this.$message.success('已禁止预约房间' + room.roomName)
          }
          resolve()
        }).catch(e => {
          // console.sysOperateLog(e);
          resolve()
        })
      })
    },
    async handleBatchDisableRoom() {
      if (this.roomSelectedList.length === 0) {
        this.$message.error('未选择要禁用的房间')
        return
      }
      if (!this.isSuperAdmin) {
        // 当前房间是不是我负责的，否则没有操作权限
        for (let i = 0; i < this.roomSelectedList.length; i++) {
          if (this.roomSelectedList[i].chargePersonId !== this.userInfo.id) {
            // 这个房间不是我负责的
            this.$message.error(this.roomSelectedList[i].roomName + '等，不是您负责的房间，无法完成操作！')
            return
          }
        }
      }
      this.$message.info('正在进行批量操作，请稍等')
      for (let room of this.roomSelectedList) {
        await this.doDisableRoom(room)
      }
    },
    doDisableRoom(room) {
      return new Promise((resolve, reject) => {
        roomApi.disableRoom(room.id).then(() => {
          if (room.state === 2) {
            room.state = 1
            this.$message.success(room.roomName + "解除禁用成功")
          } else {
            room.state = 2
            this.$message.success(room.roomName + "禁用成功")
          }
          resolve()
        }).catch(e => {
          // console.sysOperateLog(e);
          resolve()
        })
      })
    },
    getMyChargeRoom() {
      if (this.query.chargePersonId === null) {
        this.query.chargePersonId = this.userInfo.id
        this.eyeIcon = 'eye'
      } else {
        this.query.chargePersonId = null
        this.eyeIcon = 'eye-open'
      }
      this.query.page = 1
      this.getRoomList()
    },
    handleCommand(command, row) {
      switch (command) {
        case "handleDisableClick":
          this.handleDisableClick(row);
          break;
        case "handleRoomUpdateClick":
          this.handleRoomUpdateClick(row);
          break;
        case "handleAccessRecordClick":
          this.handleAccessRecordClick(row);
          break;
        default:
          break;
      }
    },
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

.oper-2 {
  margin-bottom: 18px;
  display: flex;
  justify-content: flex-start;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  background-color: #ffffff;
}
</style>
