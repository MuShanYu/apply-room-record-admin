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
      <el-button @click="handleExportData" :loading="exportBtnLoading" style="margin-left: 10px;"  icon="el-icon-download" v-waves type="primary">
        导出表格数据
      </el-button>
      <el-button @click="handleExportUserAccessCountData" :loading="exportCountBtnLoading" style="margin-left: 10px;"  icon="el-icon-download" v-waves type="primary">
        导出统计数据
      </el-button>
    </div>
    <div >
      <el-table
        key="3"
        v-loading="listLoading"
        :data="recordList"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="校区" align="center">
          <template slot-scope="{row}">
            <span>{{ row.school }}</span>
          </template>
        </el-table-column>
        <el-table-column label="楼栋" align="center">
          <template slot-scope="{row}">
            <span>{{ row.teachBuilding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roomName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state === 1 ? 'primary' : 'danger'">
              {{ row.state === 1 ? '正常' : '删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进入时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.entryTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="离开时间" align="center">
          <template slot-scope="{row}">
            <span v-if="row.outTime !== null">{{ row.outTime | parseTime }}</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button plain type="danger" @click="handleDelRecord(row, $index)" v-waves
                       v-permission="['super-admin']" style="margin: 3px;" size="mini">
              {{row.state === 1 ? '删除记录' : '取消删除'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getAccessRecordByRoomId"/>
    </div>
  </div>
</template>

<script>
import recordApi from '@/api/record'

import Pagination from "@/components/Pagination";
import {downloadFile} from "@/utils";
export default {
  name: "room-access-record-list",
  components: {
    Pagination
  },
  props: {
    roomId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      query: {
        page: 1,
        size: 10,
        roomId: '',
        startTime: new Date().getTime() - (7 * 24 * 60 * 60 * 1000),
        endTime: new Date().getTime()
      },
      listLoading: false,
      recordList: [],
      total: 0,
      selectedTime: [new Date().getTime() - (7 * 24 * 60 * 60 * 1000), new Date().getTime()],
      exportBtnLoading: false,
      exportCountBtnLoading: false,
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
  watch: {
    roomId(val, oldVal) {
      this.getAccessRecordByRoomId()
    }
  },
  created() {
    this.getAccessRecordByRoomId()
  },
  methods: {
    getAccessRecordByRoomId() {
      this.listLoading = true
      this.query.roomId = this.roomId
      recordApi.queryUserAccessRecordByRoomIdApi(this.query).then(res => {
        this.listLoading = false
        this.recordList = res.pageData
        // console.sysOperateLog(this.recordList);
        this.total = res.totalSize
      })
    },
    handleDelRecord(row, index) {
      let text = row.state === 1 ? '确定要删除该条记录吗?' : '确定要取消删除吗?'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recordApi.delRecord(row.id).then(() => {
          this.recordList.splice(index, 1)
          this.total -= 1
          this.$message.success('删除成功')
        })
      }).catch(() => {

      })
    },
    handleTimeChange(val) {
      this.query.startTime = val[0]
      this.query.endTime = val[1]
      this.query.page = 1
      this.getAccessRecordByRoomId()
    },
    handleExportData() {
      this.exportBtnLoading = true
      this.query.roomId = this.roomId
      recordApi.exportUserAccessRecordByRoomIdApi(this.query).then(response => {
        this.exportBtnLoading = false
        downloadFile(response)
      })
    },
    handleExportUserAccessCountData() {
      this.exportCountBtnLoading = true
      let that = this
      let obj = {
        roomId: that.roomId,
        startTime: that.query.startTime,
        endTime: that.query.endTime
      }
      recordApi.exportUserAccessCountDataApi(obj).then(response => {
        this.exportCountBtnLoading = false
        downloadFile(response)
      })
    }
  }
}
</script>

<style scoped>

</style>
