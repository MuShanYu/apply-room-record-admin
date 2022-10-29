<template>
  <div style="margin: 10px;">
    <div style="margin-bottom: 10px;">
      <el-select clearable @change="getRoomReservationReviewedList" style="margin-right: 10px;"
                 v-model="query.school" placeholder="请选择校区">
        <el-option
          v-for="(item, index) in school"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomReservationReviewedList" style="margin-right: 10px;"
                 v-model="query.teachBuilding" placeholder="请选择楼栋">
        <el-option
          v-for="(item, index) in teachBuilding"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomReservationReviewedList"
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
        <el-table-column label="校区" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.school }}</span>
          </template>
        </el-table-column>
        <el-table-column label="楼栋" width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.teachBuilding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间名" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roomName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备信息" align="center">
          <template slot-scope="{row}">
            <span>{{ row.equipmentInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="容量" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.capacity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类别" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column :filters="filters" :filter-method="filterHandler"
                         label="状态" width="110" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state | statusFilter">
              {{ row.state | msgFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="预约人" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约起始日期" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.reserveStartTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约结束日期" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.reserveEndTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约理由" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roomUsage }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button :disabled="row.state !== 0" @click="handleRoomReservationPassClick(row, $index)" v-waves
                       style="margin: 3px;" type="primary"
                       size="mini">
              通过
            </el-button>
            <el-button :disabled="row.state !== 0" @click="handleRoomUpdateRejectClick(row, $index)" v-waves
                       style="margin: 3px;" type="danger" size="mini">
              驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getRoomReservationReviewedList"/>
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
  },
  timeOut: {
    status: 'info',
    msg: '超时未处理'
  }
}
export default {
  name: "RoomApprove",
  components: {
    Pagination
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
        case 6:
          return statusMap.timeOut.status
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
        case 6:
          return statusMap.timeOut.msg
      }
    },
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
      listLoading: false,
      roomList: [],
      total: 0,
      teachBuilding: [],
      school: [],
      category: [],
      currentRoom: {},
      filters: [
        {text: '待审批', value: 0},
        {text: '已审批', value: 2},
        {text: '驳回', value: 4},
        {text: '用户取消', value: 3},
        {text: '超时未处理', value: 6}
      ]
    }
  },
  created() {
    this.getRoomReservationReviewedList()
    this.getRoomClassifyInfo()
  },
  methods: {
    getRoomReservationReviewedList() {
      this.listLoading = true
      roomApi.userRoomReservationReviewed(this.query).then(data => {
        this.roomList = data.pageData
        this.total = data.totalSize
        this.listLoading = false
        this.roomList.forEach(item => this.$set(item, "detailBtnLoading", false))
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
    handleRoomReservationPassClick(item, index) {
      this.$confirm('确定要通过该房间预约吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roomApi.passOrRejectRoomReserve(item.id, true).then(() => {
          item.state = 2
          this.$message.success('操作成功')
        })
      }).catch(() => {

      })
    },
    handleRoomUpdateRejectClick(item, index) {
      this.$confirm('确定要驳回该房间预约吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roomApi.passOrRejectRoomReserve(item.id, false).then(() => {
          item.state = 4
          this.$message.success('操作成功')
        })
      }).catch(() => {

      })
    },
    filterHandler(value, row, column) {
      return row.state === value;
    }
  }
}
</script>

<style scoped>

</style>
