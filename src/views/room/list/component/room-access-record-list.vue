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
      <el-button @click="handleExportData" :loading="exportBtnLoading" style="margin-left: 10px;"  icon="el-icon-download" v-waves type="primary">
        导出数据
      </el-button>
      <span style="font-size: 13px;color: #909399;margin-left: 10px;">(选择进行操作的起始和结束时间范围筛选数据)</span>
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
        <el-table-column label="楼栋"align="center">
          <template slot-scope="{row}">
            <span>{{ row.teachBuilding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roomName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昵称" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state === 1 ? 'primary' : 'danger'">
              {{ row.state === 1 ? '正常' : '删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进入时间" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.entryTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="离开时间" width="100 " align="center">
          <template slot-scope="{row}">
            <span>{{ row.outTime | parseTime }}</span>
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
        startTime: null,
        endTime: null,
        roomId: ''
      },
      listLoading: false,
      recordList: [],
      total: 0,
      selectedTime: null,
      exportBtnLoading: false
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
        // console.log(this.recordList);
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
      if (val !== null) {
        this.query.startTime = val[0]
        this.query.endTime = val[1]
      } else {
        this.query.startTime = val
        this.query.endTime = val
      }
      this.getAccessRecordByRoomId()
    },
    handleExportData() {
      this.exportBtnLoading = true
      this.query.roomId = this.roomId
      recordApi.exportUserAccessRecordByRoomIdApi(this.query).then(response => {
        this.exportBtnLoading = false
        downloadFile(response)
      })
    }
  }
}
</script>

<style scoped>

</style>
