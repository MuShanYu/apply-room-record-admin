<template>
  <div style="margin: 10px;">
    <div style="margin-bottom: 10px;">
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
      <el-button @click="addRoomDrawer = true" v-waves style="margin-left: 10px;" type="primary" icon="el-icon-plus">
        新建房间
      </el-button>
    </div>
    <div>
      <el-table
        :key="'1'"
        v-loading="listLoading"
        :data="roomList"
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
            <span>{{ row.roomName }}</span>
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
        <el-table-column label="注册日期" width="180" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button :loading="row.detailBtnLoading" @click="handleRoomReservationClick(row, $index)" v-waves style="margin: 3px;" type="primary"
                       size="mini">
              预约详情
            </el-button>
            <el-button @click="handleRoomUpdateClick(row, $index)" v-waves style="margin: 3px;" type="primary" size="mini">
              修改
            </el-button>
            <el-button type="danger" v-waves plain @click="handleDeleteClick(row)"
                       v-permission="['super-admin']" style="margin: 3px;" size="mini">
              {{row.state === -1 ? '解除' : '禁用'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getRoomList"/>
    </div>

    <!-- 查看预约详情 -->
    <el-drawer
      size="65%"
      title="预约详情"
      :show-close="false"
      :visible.sync="reservationDrawer"
      direction="rtl">
      <room-reservation-list :detail-query="detailQuery" :room-id="detailQuery.roomId"
                             :room-reservation-list="roomReservationList"
                             :total-size="roomReservationTotal" />
    </el-drawer>

    <el-drawer
      size="50%"
      title="修改房间"
      :show-close="false"
      :visible.sync="updateRoomDrawer"
      direction="rtl">
      <room-update @cancelUpdate="updateRoomDrawer = false"
                   @updateSuccess="updateRoomSuccessHandler"
                   :room="currentRoom" />
    </el-drawer>

    <el-drawer
      size="50%"
      title="修改房间"
      :show-close="false"
      :visible.sync="addRoomDrawer"
      direction="rtl">
      <room-add @cancelUpdate="addRoomDrawer = false"
                   @addSuccess="addRoomSuccessHandler"/>
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

export default {
  name: "RoomList",
  components: {
    Pagination,
    RoomReservationList,
    RoomUpdate,
    RoomAdd
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
      addRoomDrawer: false
    }
  },
  created() {
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
        this.roomList.forEach(item => this.$set(item, "detailBtnLoading", false))
        console.log(this.roomList);
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
      item.detailBtnLoading = true
      roomApi.roomReservationDetail(this.detailQuery).then(data => {
        this.roomReservationList = data.pageData
        this.roomReservationTotal = data.totalSize
        // console.log(this.roomReservationList);
        item.detailBtnLoading = false
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
    }
  }
}
</script>

<style scoped>

</style>
