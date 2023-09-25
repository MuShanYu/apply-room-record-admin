<template>
  <div>
    <el-table :key="'1'" v-loading="listLoading" :data="dataList" fit highlight-current-row style="width: 100%;">
      <el-table-column label="学号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签到时间" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.entryTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签退时间" width="160" align="center">
        <template slot-scope="{row}">
          <span v-if="row.outTime !== null">{{ row.outTime | parseTime }}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column prop="validAttendanceHours" label="有效时长" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.validAttendanceHours }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button plain type="danger" @click="handleDelAttendance(row, $index)" v-waves
            v-permission="['super-admin']" style="margin: 3px;" size="mini">
            {{row.state === 1 ? '删除记录' : '取消删除'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page-sizes="[5,10]" :page.sync="query.page" :limit.sync="query.size"
      @pagination="getRoomAttendanceDetailList" />
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import attendanceApi from "@/api/attendance";
  import recordApi from '@/api/record'

  export default {
    name: "RoomAttendanceDetail",
    props: {
      roomId: {
        type: String,
        default: ''
      },
      startTime: {
        type: Number,
        default: new Date().getTime() - (7 * 24 * 60 * 60 * 1000)
      },
      endTime: {
        type: Number,
        default: new Date().getTime()
      },
      userId: {
        type: String,
        default: ''
      }
    },
    components: {
      Pagination,
    },
    watch: {
      roomId(val, oldVal) {
        this.getRoomAttendanceDetailList()
      },
      userId(val, oldVal) {
        this.getRoomAttendanceDetailList()
      },
      startTime(val, oldVal) {
        this.getRoomAttendanceDetailList()
      },
      endTime(val, oldVal) {
        this.getRoomAttendanceDetailList()
      }
    },
    data() {
      return {
        listLoading: false,
        query: {
          page: 1,
          size: 5,
          startTime: new Date().getTime() - (7 * 24 * 60 * 60 * 1000),
          endTime: new Date().getTime(),
          roomId: '',
          userId: ''
        },
        dataList: [],
        total: 0,
      }
    },
    created() {
      this.getRoomAttendanceDetailList()
    },
    methods: {
      getRoomAttendanceDetailList() {
        this.listLoading = true
        this.query.startTime = this.startTime
        this.query.endTime = this.endTime
        this.query.userId = this.userId
        this.query.roomId = this.roomId
        console.log(this.startTime + " " + this.endTime + " " + this.userId + " " + this.roomId);
        attendanceApi.queryAttendanceCountDetailList(this.query).then(data => {
          this.dataList = data.pageData
          this.total = data.totalSize
          // console.log(this.dataList);
          this.listLoading = false
        }).catch(e => {
          this.listLoading = false
        })
      },
      handleDelAttendance(row, index) {
        let text = row.state === 1 ? '确定要删除该条记录吗?' : '确定要取消删除吗?'
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          recordApi.delRecord(row.id).then(() => {
            if (row.state === 1) {
              row.state = -1
              this.$message.success('删除成功')
            } else {
              row.state = 1
              this.$message.success('取消删除成功')
            }
          })
        }).catch(() => {

        })
      },
    }
  }
</script>

<style scoped>

</style>