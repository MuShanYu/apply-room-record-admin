<template>
  <div style="margin: 10px;">
    <div style="margin-bottom: 10px;">
      <el-date-picker
        @change="handleTimeChange"
        v-model="selectedTime"
        value-format="timestamp"
        type="datetimerange"
        range-separator="至"
        start-placeholder="起始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <span style="font-size: 13px;color: #909399;margin-left: 10px;">(选择进行操作的起始和结束时间范围筛选数据)</span>
    </div>
    <div>
      <el-table
        :key="'1'"
        v-loading="listLoading"
        :data="dataList"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="预约人" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作日期(预约时间)" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约起始时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.reserveStartTime | parseTime  }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约结束时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.reserveEndTime | parseTime  }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约理由" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roomUsage }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.verifyUserName === null ? '暂无' : row.verifyUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state | statusFilter">
              {{ row.state | msgFilter }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getRoomReservationList"/>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import roomApi from "@/api/room";
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
  name: "RoomReservationList",
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
  props: {
    roomReservationList: {
      type: Array,
      default() {
        return []
      }
    },
    totalSize: {
      type: Number,
      default: 0
    },
    roomId: {
      type: String,
      default: ''
    },
    detailQuery: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    Pagination
  },
  watch: {
    roomReservationList(val, oldVal) {
      this.$nextTick(() => {
        this.dataList = val
      })
    },
    detailQuery(val, oldVal) {
      this.$nextTick(() => {
        this.query = val
      })
    },
    totalSize(val, oldVal) {
      this.$nextTick(() => {
        this.total = val
      })
    }
  },
  data() {
    return {
      listLoading: false,
      query: this.detailQuery,
      dataList: this.roomReservationList,
      total: this.totalSize,
      selectedTime: ''
    }
  },
  methods: {
    getRoomReservationList() {
      this.listLoading = true
      roomApi.roomReservationDetail(this.query).then(data => {
        this.dataList = data.pageData
        this.total = data.totalSize
        // console.log(this.dataList);
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },
    handleTimeChange(val) {
      if (val !== null) {
        this.query.startTime = val[0]
        this.query.endTime = val[1]
      } else {
        this.query.startTime = val
        this.query.endTime = val
      }
      this.getRoomReservationList()
    }
  }
}
</script>

<style scoped>

</style>
