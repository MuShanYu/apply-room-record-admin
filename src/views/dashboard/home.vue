<template>
  <div class="home-container">
    <div>
      <panel-group :loading="countLoading" :count-data="countData"/>
    </div>
    <div style="margin-bottom: 10px;background: #ffffff;padding: 15px;" class="">
      <div style="display: flex;justify-content: flex-start;">
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
        <el-select style="margin-left: 15px;"
                   clearable
                   @change="getCountData" v-model="roomCountDTO.roomCategory"
                   placeholder="请选择房间类别">
          <el-option
            v-for="(item, index) in category"
            :label="item"
            :key="index"
            :value="item">
          </el-option>
        </el-select>
        <el-select style="margin-left: 15px;"
                   v-model="roomCountDTO.roomId"
                   clearable
                   @change="getCountData"
                   filterable
                   remote
                   reserve-keyword
                   placeholder="请输入房间名称"
                   :remote-method="getRoomName"
                   :loading="selectLoading">
          <el-option
            v-for="item in roomOptions"
            :key="item.id"
            :label="item.roomName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="handleExportCountDataClick" icon="el-icon-download"
                   style="margin-left: 15px;" type="primary">导出报表数据
        </el-button>
      </div>
      <div style="text-align: left;margin-top: 15px;">
        <span style="color: #909399;font-size: 12px">
        （图表最多展示14天的数据，超出会有提示）（房间名称和房间类别为非必要筛选数据）
        </span>
        <span style="color: #909399;font-size: 12px;">
        （说明:一天是指从00:00:00~23:59:59）
        </span>
        <span style="color: #909399;font-size: 12px;">
        （说明:人次是指用户的扫码次数，人数是指在指定时间段有哪些人来过）
        </span>
      </div>
    </div>

    <div v-loading="loading" class="chart-wrapper">
      <line-chart :chart-data="accessRecordCount" :class-name="'line-chart'"/>
    </div>
    <div v-loading="loading" class="chart-wrapper">
      <bar-chart :chart-data="accessRecordCount" :class-name="'bar-chart'"/>
    </div>
    <div v-loading="loading" class="chart-wrapper">
      <line-marker :chart-data="roomReserveCount" :id="'line-marker'" :width="'100%'" :height="'400px'"/>
    </div>
    <div v-loading="loading" class="chart-wrapper">
      <pie-chart :chart-data="roomReserveCount" :class-name="'pie-chart'"/>
    </div>

    <el-dialog
      title="请您核对数据导出条件"
      center
      :visible.sync="exportDialog">
      <div>
        <div>
          <el-descriptions :column="2" border>
            <template slot="extra">
              <el-button :loading="exportCountDataBtnLoading" @click="exportCountData" size="small"
                         icon="el-icon-download" type="primary">导出
              </el-button>
            </template>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-postcard"></i>
                房间类型
              </template>
              {{ filterCondition.roomCategory === '' ? '未指定房间类型' : filterCondition.roomCategory }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-school"></i>
                房间名称
              </template>
              {{ filterCondition.roomName === '' ? '未指定房间名称' : filterCondition.roomName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-watch"></i>
                起始时间
              </template>
              {{ filterCondition.startTime }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-watch"></i>
                结束时间
              </template>
              {{ filterCondition.endTime }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div style="margin-top: 15px;text-align: center;">
          <span style="color: #909399;font-size: 12px;">
        （说明:只会导出在指定时间段内有数据的房间统计信息）
        </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dataStatistics from "@/api/data-statistics";
import {downloadFile} from "@/utils";

import PanelGroup from "@/views/dashboard/component/PanelGroup";
import LineMarker from "@/components/Charts/LineMarker";
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import LineChart from "@/components/Charts/LineChart";

export default {
  name: 'Dashboard',
  computed: {},
  components: {
    LineMarker,
    PieChart,
    LineChart,
    BarChart,
    PanelGroup
  },
  data() {
    return {
      roomOptions: [],
      roomName: '',
      roomCountDTO: {
        roomId: '',
        roomCategory: '',
        startTime: new Date().getTime() - (7 * 24 * 60 * 60 * 1000),
        endTime: new Date().getTime()
      },
      roomReserveCount: {},
      accessRecordCount: {},
      countData: {
        accessRecordCount: 0,
        roomCount: 0,
        roomReserveReviewed: 0,
        userCount: 0
      },
      selectLoading: false,
      loading: true,
      countLoading: true,
      category: [],
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
      exportCountDataBtnLoading: false,
      exportDialog: false,
      filterCondition: {
        roomName: '',
        roomCategory: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  created() {
    this.getCountData()
    this.getSystemCountInfo()
    this.getRoomClassifyInfo()
  },
  methods: {
    getRoomClassifyInfo() {
      dataStatistics.getRoomClassifyInfo().then(data => {
        this.category = data.categories
      })
    },
    getCountData() {
      this.loading = true
      dataStatistics.countRoomReservationTimes(this.roomCountDTO).then(data => {
        this.roomReserveCount = data
      }).then(() => {
        dataStatistics.countAccessRecordApi(this.roomCountDTO).then(data => {
          this.accessRecordCount = data
          this.loading = false
        })
      })
    },
    getSystemCountInfo() {
      this.countLoading = true
      dataStatistics.getSystemCount().then(data => {
        this.countData = data.countData
        this.countLoading = false
      })
    },
    getRoomName(roomName) {
      if (roomName !== '') {
        this.selectLoading = true
        dataStatistics.searchRoomByName(roomName).then(res => {
          this.roomOptions = res
          this.selectLoading = false
        })
      }
    },
    handleTimeChange(val) {
      let days = (val[1] - val[0]) / 1000 / 60 / 60 / 24
      if (days > 14) {
        this.roomCountDTO.startTime = val[1] - (3600 * 1000 * 24 * 14)
        this.$notify({
          title: '系统提示',
          message: '您所选择的时间跨度大于14天，下面图表将显示近14天的数据，这不影响您导出数据',
          type: 'warning',
          duration: 6000
        });
      } else {
        this.roomCountDTO.startTime = val[0]
      }
      this.roomCountDTO.endTime = val[1]
      this.getCountData()
    },
    dateInYearMonthDay(mills) {
      let date = new Date(mills)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      return year + '-' + month + '-' + day
    },
    handleExportCountDataClick() {
      if (this.roomCountDTO.roomId !== '') {
        let index = this.roomOptions.findIndex(v => v.id === this.roomCountDTO.roomId)
        this.filterCondition.roomName = this.roomOptions[index].roomName
      } else {
        this.filterCondition.roomName = ''
      }
      if (this.roomCountDTO.roomCategory !== '') {
        this.filterCondition.roomCategory = this.roomCountDTO.roomCategory
      } else {
        this.filterCondition.roomCategory = ''
      }
      this.filterCondition.startTime = this.dateInYearMonthDay(this.roomCountDTO.startTime)
      this.filterCondition.endTime = this.dateInYearMonthDay(this.roomCountDTO.endTime)
      this.exportDialog = true
    },
    exportCountData() {
      this.exportCountDataBtnLoading = true
      dataStatistics.countRoomRecordAccessCountData(this.roomCountDTO).then(response => {
        this.exportCountDataBtnLoading = false
        this.exportDialog = false
        this.$message.success('统计数据成功导出')
        downloadFile(response)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
