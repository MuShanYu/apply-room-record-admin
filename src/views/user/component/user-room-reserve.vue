<template>
  <div style="margin: 10px;">
    <div style="margin-bottom: 10px;">
      <el-select clearable @change="getRoomReserveList" style="margin-right: 10px;"
                 v-model="query.school" placeholder="请选择校区">
        <el-option
          v-for="(item, index) in school"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomReserveList" style="margin-right: 10px;"
                 v-model="query.teachBuilding" placeholder="请选择楼栋">
        <el-option
          v-for="(item, index) in teachBuilding"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomReserveList"
                 v-model="query.category" placeholder="请选择类别">
        <el-option
          v-for="(item, index) in category"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
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
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state | statusFilter">
              {{ row.state | msgFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审批人" width="100" align="center">
          <template slot-scope="{row}">
            {{ row.verifyUserName === null ? '暂无' : row.verifyUserName}}
          </template>
        </el-table-column>
        <el-table-column label="预约起始日期" width="180" align="center">
          <template slot-scope="{row}">
            <span>{{ row.reserveStartTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约结束日期" width="180" align="center">
          <template slot-scope="{row}">
            <span>{{ row.reserveEndTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约理由" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roomUsage }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作日期" width="180" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getRoomReserveList"/>
    </div>
  </div>
</template>

<script>
import roomApi from '@/api/room'
import dataStatistics from "@/api/data-statistics";

import Pagination from "@/components/Pagination";

const statusMap = {
  notReviewed: {
    status: 'warning',
    msg: '待审批'
  },
  ban: {
    status: 'danger',
    msg: '驳回'
  },
  reviewed: {
    status: 'success',
    msg: '已审批'
  },
  userCanceled: {
    status: 'info',
    msg: '用户取消'
  }
}
export default {
  name: "user-room-reserve",
  components: {
    Pagination
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    id(val, oldVal) {
      this.userId = val
      this.query.userId = val
      this.getRoomReserveList()
    }
  },
  filters: {
    statusFilter(status) {
      switch (status) {
        case 1:
          return 'primary'
        case -1:
          return 'info'
        case 4:
          return statusMap.ban.status
        case 0:
          return statusMap.notReviewed.status
        case 3:
          return statusMap.userCanceled.status
        case 2:
          return statusMap.reviewed.status
      }
    },
    msgFilter(status) {
      switch (status) {
        case 4:
          return statusMap.ban.msg
        case 0:
          return statusMap.notReviewed.msg
        case 3:
          return statusMap.userCanceled.msg
        case 2:
          return statusMap.reviewed.msg
      }
    },
  },
  data() {
    return {
      userId: this.id,
      teachBuilding: [],
      school: [],
      category: [],
      query: {
        page: 1,
        size: 10,
        userId: '',
        school: '',
        teachBuilding: '',
        category: ''
      },
      listLoading: false,
      roomList: [],
      total: 0
    }
  },
  created() {
    this.query.userId = this.userId
    this.getRoomReserveList()
    this.getRoomClassifyInfo()
  },
  methods: {
    getRoomReserveList() {
      this.listLoading = true
      roomApi.userRoomReservationRecord(this.query).then(data => {
        this.roomList = data.pageData
        this.total = data.totalSize
        this.listLoading = false
        this.roomList.forEach(item => this.$set(item, "detailBtnLoading", false))
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
  }
}
</script>

<style scoped>

</style>
