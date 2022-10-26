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
      <el-button v-permission="['super-admin']" @click="addRoomDrawer = true" v-waves style="margin-left: 10px;" type="primary" icon="el-icon-plus">
        新建房间
      </el-button>
      <el-button v-permission="['super-admin']" @click="$router.push('/room/import')"
                 v-waves style="margin-left: 10px;" type="primary" icon="el-icon-upload2">
        批量导入
      </el-button>
      <el-button v-permission="['super-admin']" @click="handleBatchDownloadQRCode"
                 v-waves style="margin-left: 10px;" type="primary" icon="el-icon-picture-outline">
        批量生成二维码
      </el-button>
      <el-link :href="constants.roomExcelHref" v-permission="['super-admin']" style="margin-left: 10px;" :underline="false" type="primary">房间信息导入模板下载</el-link>
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
        <el-table-column label="校区" width="150" align="center">
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
        <el-table-column label="容量" width="150" align="center">
          <template slot-scope="{row}">
            <span>{{ row.capacity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类别" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state === 1 ? 'primary' : 'danger'">
              {{ row.state === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人" align="center">
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
            <el-button v-if="currentUserId === row.chargePersonId || isSuperAdmin" :disabled="row.state !== 1" @click="handleRoomUpdateClick(row, $index)" v-waves
                       style="margin: 3px;" type="info" size="mini">
              修改
            </el-button>
            <el-button v-if="row.chargePersonId === currentUserId || isSuperAdmin" type="danger" v-waves plain
                       @click="handleDeleteClick(row)" style="margin: 3px;" size="mini">
              {{ row.state === -1 ? '解除' : '禁用' }}
            </el-button>
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
        category: ''
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
    handleDeleteClick(room) {
      let text = room.state === 1 ? '确定要禁用该房间吗?' : '确定要解除禁用该房间吗?'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roomApi.delRoom(room.id).then(() => {
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
