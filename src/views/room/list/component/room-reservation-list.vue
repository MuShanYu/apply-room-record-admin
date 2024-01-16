<template>
  <div style="margin: 10px;">
    <div style="margin-bottom: 10px;">
      <el-date-picker
        :clearable="false"
        @change="handleTimeChange"
        v-model="selectedTime"
        value-format="timestamp"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="起始日期"
        end-placeholder="结束日期">
      </el-date-picker>
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
        <el-table-column label="预约人" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center">
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
    status: 'primary',
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
    status: 'warning',
    msg: '超时未处理'
  }
}
export default {
  name: "RoomReservationList",
  filters: {
    statusFilter(status) {
      switch (status) {
        case 0:
          return statusMap.notReviewed.status
        case 1:
          return statusMap.reviewed.status
        case 2:
          return statusMap.userCanceled.status
        case 3:
          return statusMap.ban.status
        case 4:
          return statusMap.timeOut.status
      }
    },
    msgFilter(status) {
      switch (status) {
        case 0:
          return statusMap.notReviewed.msg
        case 1:
          return statusMap.reviewed.msg
        case 2:
          return statusMap.userCanceled.msg
        case 3:
          return statusMap.ban.msg
        case 4:
          return statusMap.timeOut.msg
      }
    },
  },
  props: {
    roomId: {
      type: String,
      default: ''
    }
  },
  components: {
    Pagination
  },
  watch: {
    roomId(val, oldVal) {
      this.getRoomReservationList()
    }
  },
  data() {
    return {
      listLoading: false,
      query: {
        page: 1,
        size: 10,
        startTime: new Date().getTime() - (7 * 24 * 60 * 60 * 1000),
        endTime: new Date().getTime(),
        roomId: ''
      },
      dataList: [],
      total: 0,
      selectedTime: [new Date().getTime() - (7 * 24 * 60 * 60 * 1000), new Date().getTime()],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start.getTime(), end.getTime()]);
          }
        }, {
          text: '最近半个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
            picker.$emit('pick', [start.getTime(), end.getTime()]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start.getTime(), end.getTime()]);
          }
        }]
      },
    }
  },
  created() {
    this.getRoomReservationList()
  },
  methods: {
    getRoomReservationList() {
      this.listLoading = true
      this.query.roomId = this.roomId
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
      this.query.startTime = val[0]
      this.query.endTime = val[1]
      this.query.page = 1
      this.getRoomReservationList()
    }
  }
}
</script>

<style scoped>

</style>
