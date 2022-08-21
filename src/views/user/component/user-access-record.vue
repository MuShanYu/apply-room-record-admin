<template>
  <div style="margin: 10px;">
    <div style="margin-bottom: 10px;text-align: right;">
      <el-button :loading="btnLoading" @click="handleSeeCount" icon="el-icon-s-data" plain>
        {{seeCount ? '取消查看' : '查看统计结果'}}
      </el-button>
    </div>
    <div v-show="!seeCount">
      <el-table
        key="3"
        v-loading="listLoading"
        :data="recordList"
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
        <el-table-column label="容量" align="center">
          <template slot-scope="{row}">
            <span>{{ row.capacity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类别" align="center">
          <template slot-scope="{row}">
            <span>{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
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
                  @pagination="getUserAccessRecordListAdmin"/>
    </div>
    <div v-show="seeCount">
      <el-table
        key="3"
        v-loading="countLoading"
        :data="countList"
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
        <el-table-column label="类别" align="center">
          <template slot-scope="{row}">
            <span>{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进入次数" align="center">
          <template slot-scope="{row}">
            <span>{{ row.entryTimes }}</span>
          </template>
        </el-table-column>
        <el-table-column label="离开次数" align="center">
          <template slot-scope="{row}">
            <span>{{ row.outTimes }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="countTotal>0" :total="countTotal" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getUserAccessCountAdmin"/>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

import recordApi from '@/api/record'

export default {
  name: "user-access-record",
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    Pagination
  },
  watch: {
    id(val, oldVal) {
      this.query.userId = val
      this.getUserAccessRecordListAdmin()
    }
  },
  data() {
    return {
      query: {
        page: 1,
        size: 10,
        userId: ''
      },
      countList: [],
      recordList: [],
      total: 0,
      listLoading: false,
      seeCount: false,
      countTotal: 0,
      countLoading: false,
      btnLoading: false
    }
  },
  created() {
    this.query.userId = this.id
    this.getUserAccessRecordListAdmin()
  },
  methods: {
    getUserAccessCountAdmin() {
      this.countLoading = true
      this.btnLoading = true
      recordApi.userAccessCountAdminApi(this.query).then(res => {
        this.countList = res.pageData
        this.countTotal = res.totalSize
        this.countLoading = false
        this.btnLoading = false
        console.log(this.countList);
      }).catch(e => {
        this.countLoading = false
        this.btnLoading = false
      })
    },
    getUserAccessRecordListAdmin() {
      this.listLoading = true
      recordApi.userAccessRecordListAdminApi(this.query).then(res => {
        this.recordList = res.pageData
        this.total = res.totalSize
        this.listLoading = false
        // console.log(this.recordList);
      }).catch(e => {
        this.listLoading = false
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
    handleSeeCount() {
      this.query.page = 1
      if (this.seeCount) {
        this.seeCount = false
      } else {
        this.seeCount = true
        this.getUserAccessCountAdmin()
      }
    }
  }
}
</script>

<style scoped>

</style>
