<template>
  <div style="margin: 10px;">
    <div style="margin-bottom: 10px;margin-top: 10px;">
      <el-select clearable @change="getRoomList" style="margin-right: 10px;"
                 v-model="query.school" placeholder="请选择校区">
        <el-option
          v-for="(item, index) in school"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomList" style="margin-right: 10px;"
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
      <el-input v-model="query.roomName"
                clearable
                @clear="getRoomList"
                placeholder="请输入检索的房间名称" style="width: 200px;margin-left: 10px;"
                @keyup.enter.native="getRoomList"/>
      <el-button v-waves style="margin-left: 10px;" type="primary" icon="el-icon-search"
                 @click="getRoomList">
        搜索
      </el-button>
      <el-button v-permission="['super-admin']" @click="addRoomDrawer = true" v-waves style="margin-left: 10px;" type="primary" icon="el-icon-plus">
        新建房间
      </el-button>
      <el-button v-permission="['super-admin']" @click="$router.push('/room/import')"
                 v-waves style="margin-left: 10px;" type="primary" icon="el-icon-upload2">
        批量导入
      </el-button>
    </div>
    <div style="margin-bottom: 10px;">
      <el-button v-permission="['super-admin']" @click="handleBatchDownloadQRCode"
                 v-waves type="primary" icon="el-icon-picture-outline">
        批量生成房间二维码
      </el-button>
      <el-tooltip effect="light" placement="bottom-end">
        <el-button @click="handleBatchDisableReserve" v-waves type="primary" icon="el-icon-close">
          批量禁止预约
        </el-button>
        <div slot="content">
          是禁止预约状态的房间会被重置为正常状态，<br/>正常状态的房间会被重置为禁止预约状态
        </div>
      </el-tooltip>
      <el-tooltip effect="light" placement="bottom-end">
        <el-button @click="handleBatchDisableRoom" v-waves type="danger" icon="el-icon-delete">
          批量禁用
        </el-button>
        <div slot="content">
          是禁用状态的房间会被重置为正常状态，<br/>正常状态的房间会被重置为禁止状态
        </div>
      </el-tooltip>
      <el-link :href="constants.roomExcelHref" v-permission="['super-admin']" style="margin-left: 10px;" :underline="false" type="primary">房间信息导入模板下载</el-link>
      <span style="margin-left: 10px;font-size: 12px;color: #909399;">(注意不可以同时设置为禁止预约状态和禁用状态)</span>
      <span style="margin-left: 10px;font-size: 12px;color: #909399;">(条件均为空时点击搜索查看的是全部数据)</span>
    </div>
    <div>
      <el-table
        :key="'1'"
        v-loading="listLoading"
        :data="roomList"
        border
        fit
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
            <span @click="handleCopy(constants.qrCodeUrlPrefix + row.id, $event)" class="link-type">{{ row.roomName }}</span>
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
            <el-tag :type="row.state === 1 || row.state === 5 ? 'primary' : 'danger'">
              {{ row.state | roomStateFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.chargePerson }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button @click="handleRoomReservationClick(row, $index)" v-waves
                       style="margin: 3px;" type="primary"
                       size="mini">
              预约详情
            </el-button>
            <el-button :loading="row.detailBtnLoading" @click="handleAccessRecordClick(row, $index)" v-waves
                       style="margin-left: 3px;" type="primary"
                       size="mini">
              足迹详情
            </el-button>
            <el-button v-if="currentUserId === row.chargePersonId || isSuperAdmin" @click="handleRoomUpdateClick(row, $index)" v-waves
                       style="margin: 3px;" type="info" size="mini">
              修改
            </el-button>

            <el-tooltip effect="light" placement="bottom-start">
              <el-button v-if="row.chargePersonId === currentUserId || isSuperAdmin" type="danger" v-waves plain
                         @click="handleDisableClick(row)" style="margin: 3px;" size="mini">
                {{ row.state === -1 ? '解除' : '禁用' }}
              </el-button>
              <div slot="content">
                禁用是指该房间相关数据将不会再被统计，<br/>但是不影响旧数据的查看与统计
              </div>
            </el-tooltip>
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
      <room-qr-code-generate :room-list="roomSelectedList" />
    </el-dialog>

    <!-- 查看预约详情 -->
    <el-drawer
      size="65%"
      title="预约详情"
      :show-close="false"
      :visible.sync="reservationDrawer"
      direction="rtl">
      <room-reservation-list :detail-query="detailQuery" :room-id="detailQuery.roomId"
                             :room-reservation-list="roomReservationList"
                             :total-size="roomReservationTotal"/>
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
  </div>
</template>

<script>
import roomApi from '@/api/room'
import dataStatistics from "@/api/data-statistics";

import Pagination from "@/components/Pagination";
import RoomReservationList from "@/views/room/list/component/room-reservation-list";
import RoomUpdate from "@/views/room/list/component/room-update";
import RoomAdd from "@/views/room/list/component/room-add";
import RoomAccessRecordList from "@/views/room/list/component/room-access-record-list";
import RoomQrCodeGenerate from "@/views/room/list/component/room-qr-code-generate";

import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js'
import {mapGetters} from "vuex"; // use clipboard by v-directive
import constants from "@/common/CommonCantans";

export default {
  name: "RoomList",
  directives: {
    clipboard
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'roles'
    ]),
    constants() {
      return constants;
    }
  },
  filters: {
    roomStateFilter(state) {
      switch (state) {
        case -1:
          return '禁用'
        case 1:
          return '正常'
        case 5:
          return '禁止预约'
      }
    }
  },
  components: {
    Pagination,
    RoomReservationList,
    RoomUpdate,
    RoomAdd,
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
        roomName: ''
      },
      detailQuery: {
        page: 1,
        size: 10,
        startTime: null,
        endTime: null,
        roomId: ''
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
      currentUserId: '',
      isSuperAdmin: false,
      roomSelectedList: [],
      generateQRCodeDialog: false
    }
  },
  created() {
    this.currentUserId = this.userInfo.id
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
        // console.log(this.roomList);
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
    handleRoomReservationClick(item, index) {
      this.detailQuery.roomId = item.id
      roomApi.roomReservationDetail(this.detailQuery).then(data => {
        this.roomReservationList = data.pageData
        this.roomReservationTotal = data.totalSize
        // console.log(this.roomReservationList);
        this.reservationDrawer = true
      })
    },
    handleRoomUpdateClick(item, index) {
      this.currentRoom = Object.assign({}, item)
      this.updateRoomDrawer = true
    },
    updateRoomSuccessHandler(room) {
      let roomIndex = this.roomList.findIndex(item => item.id === room.id)
      this.roomList.splice(roomIndex, 1, room);
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
          if (room.state === -1) {
            room.state = 1
            this.$message.success("解除禁用成功")
          } else {
            room.state = -1
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
    handleCopy(text, event) {
      clip(text, event)
    },
    handleAccessRecordClick(row, index) {
      this.currentRoomId = row.id
      this.accessRecordDrawer = true
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
      this.$message.info('正在进行批量操作，请稍等')
      for(let room of this.roomSelectedList) {
        await this.doDisableReserveRoom(room)
      }
    },
    doDisableReserveRoom(room) {
      return new Promise((resolve, reject) => {
        roomApi.disableReserveRoom(room.id).then(() => {
          if (room.state === 5) {
            room.state = 1
            this.$message.success('已解除' + room.roomName + '的禁止预约')
          } else {
            room.state = 5
            this.$message.success('已禁止预约房间' + room.roomName)
          }
          resolve()
        }).catch(e => {
          console.log(e);
          resolve()
        })
      })
    },
    async handleBatchDisableRoom() {
      if (this.roomSelectedList.length === 0) {
        this.$message.error('未选择要禁用的房间')
        return
      }
      this.$message.info('正在进行批量操作，请稍等')
      for(let room of this.roomSelectedList) {
        await this.doDisableRoom(room)
      }
    },
    doDisableRoom(room) {
      return new Promise((resolve, reject) => {
        roomApi.disableRoom(room.id).then(() => {
          if (room.state === -1) {
            room.state = 1
            this.$message.success(room.roomName + "解除禁用成功")
          } else {
            room.state = -1
            this.$message.success(room.roomName + "禁用成功")
          }
          resolve()
        }).catch(e => {
          console.log(e);
          resolve()
        })
      })
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
