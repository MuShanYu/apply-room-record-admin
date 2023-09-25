<template>
  <div style="margin: 10px;">
    <div id="room-list-room-name" style="margin-bottom: 10px;display: flex;">
      <el-date-picker :clearable="false" @change="handleTimeChange" v-model="selectedTime" value-format="timestamp"
        type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="起始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-input v-model="query.name" clearable @clear="getRoomAttendanceList" placeholder="请输入姓名"
        style="width: 200px;margin-left: 10px;" @keyup.enter.native="getRoomAttendanceList" />
      <el-button v-waves style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="getRoomAttendanceList">
        搜索
      </el-button>
    </div>
    <div>
      <el-table :key="'1'" v-loading="listLoading" :data="dataList" border fit highlight-current-row
        style="width: 100%;">
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
        <el-table-column label="学院" align="center">
          <template slot-scope="{row}">
            <span>{{ row.institute }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="validAttendanceHours" label="有效签到时长" sortable align="center">
          <template slot-scope="{row}">
            <span>{{ row.validAttendanceHours }}</span>
          </template>
        </el-table-column>
        <el-table-column width="250" label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button @click="handleAttendanceDetailClick(row)" v-waves style="margin: 3px;" type="primary"
              size="mini">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="个人签到详情" :visible.sync="dialogVisible" width="60%" append-to-body>
        <RoomAttendanceDetail :room-id="roomId" :user-id="currentUserId" :start-time="query.startTime" :end-time="query.endTime"/>
      </el-dialog>
      <pagination v-show="total > 0" :total="total" :page.sync="query.page" :limit.sync="query.size"
        @pagination="getRoomAttendanceList" />
    </div>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import attendanceApi from "@/api/attendance";
  import RoomAttendanceDetail from "@/views/room/list/component/room-attendance-detail";

  export default {
    name: "RoomAttendanceList",
    props: {
      roomId: {
        type: String,
        default: ''
      }
    },
    components: {
      Pagination,
      RoomAttendanceDetail
    },
    watch: {
      roomId(val, oldVal) {
        this.getRoomAttendanceList()
      }
    },
    data() {
      return {
        listLoading: false,
        dialogVisible:false,
        query: {
          page: 1,
          size: 10,
          startTime: new Date().getTime() - (7 * 24 * 60 * 60 * 1000),
          endTime: new Date().getTime(),
          roomId: '',
          name: ''
        },
        currentUserId:'',
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
      this.getRoomAttendanceList()
    },
    methods: {
      getRoomAttendanceList() {
        this.listLoading = true
        this.query.roomId = this.roomId
        attendanceApi.queryAttendanceCountList(this.query).then(data => {
          this.dataList = data.pageData
          this.total = data.totalSize
          // console.log(this.dataList);
          this.listLoading = false
        }).catch(e => {
          this.listLoading = false
        })
      },
      handleAttendanceDetailClick(row){
        this.currentUserId = row.userId
        this.dialogVisible = true
      },
      handleTimeChange(val) {
        this.query.startTime = val[0]
        this.query.endTime = val[1]
        this.query.page = 1
        this.getRoomAttendanceList()
      }
    }
  }
</script>

<style scoped>

</style>