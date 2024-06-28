<template>
  <div class="home-container">
    <panel-group :loading="countLoading" :count-data="countData"/>

    <el-card shadow="hover" :body-style="{ padding: '0'}" style="margin-bottom: 20px;background: #ffffff;padding: 15px;">
      <div style="display: flex;justify-content: flex-start;">
        <div id="home-select-time">
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
        <div id="home-select-room-category" style="margin-left: 15px;">
          <el-select clearable
                     @change="getCountData" v-model="roomCountDTO.roomCategory"
                     placeholder="请选择房间类别">
            <el-option
              v-for="(item, index) in category"
              :label="item"
              :key="index"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div id="home-search-room-name" style="margin-left: 15px;">
          <el-select v-model="roomCountDTO.roomId"
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
        </div>
        <div id="home-export-btn" style="margin-left: 15px;display: flex;align-items: center;" >
          <el-checkbox v-permission="['work:statistics:self']" @change="handleCheckBoxChange" style="margin-right: 15px;" v-model="iManaged" label="我管理的" border></el-checkbox>
          <el-button v-permission="['work:statistics:export']" @click="handleExportCountDataClick" icon="el-icon-download" type="primary">
            导出报表数据
          </el-button>
          <span style="font-size: 13px;color: #909399;">（统计分析筛选条件）</span>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" justify="space-between">
      <el-col :xl="10" :lg="10" :md="24" :sm="24" :xs="24">
        <el-card shadow="hover" style="margin-bottom: 20px;">
          <el-skeleton :loading="loading" animated :rows="4">
            <pie-chart :chart-data="roomReserveCount" :class-name="'pie-chart'"/>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
        <el-card shadow="hover" style="margin-bottom: 20px;">
          <el-skeleton :loading="loading" animated :rows="4">
            <bar-chart :chart-data="accessRecordCount" :class-name="'bar-chart'"/>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover" style="margin-bottom: 20px;">
          <el-skeleton :loading="loading" animated :rows="4">
            <line-chart :chart-data="roomReserveCount" :class-name="'line-chart'"/>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="请您核对数据导出条件（导出人员进出统计信息）"
      center
      :visible.sync="exportDialog">
      <div>
        <div>
          <el-descriptions :column="2" border>
            <template slot="extra">
              <el-button :loading="exportCountDataBtnLoading" @click="exportCountData" size="small"
                         icon="el-icon-download" type="primary">{{iManaged ? '导出我管理的' : '导出'}}
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
              {{ filterCondition.startTime | parseTime('{y}-{m}-{d}') }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-watch"></i>
                结束时间
              </template>
              {{ filterCondition.endTime | parseTime('{y}-{m}-{d}') }}
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

import PanelGroup from "./component/PanelGroup";
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import LineChart from "@/components/Charts/LineChart";

export default {
  name: 'DataStatistics',
  computed: {},
  components: {
    PieChart,
    LineChart,
    BarChart,
    PanelGroup
  },
  data() {
    return {
      iManaged: true,
      roomOptions: [],
      roomName: '',
      roomCountDTO: {
        roomId: '',
        roomCategory: '',
        startTime: new Date().getTime() - (7 * 24 * 60 * 60 * 1000),
        endTime: new Date().getTime(),
        chargerPersonId: null
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
    this.roomCountDTO.chargerPersonId = this.$store.getters.userInfo.id;
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
      this.filterCondition.startTime = this.selectedTime[0]
      this.filterCondition.endTime = this.selectedTime[1]
      this.exportDialog = true
    },
    exportCountData() {
      this.exportCountDataBtnLoading = true
      let obj = Object.assign({}, this.roomCountDTO)
      obj.startTime = this.selectedTime[0]
      obj.endTime = this.selectedTime[1]
      dataStatistics.countRoomRecordAccessCountData(obj).then(response => {
        this.exportCountDataBtnLoading = false
        this.exportDialog = false
        this.$message.success('统计数据成功导出')
        downloadFile(response)
      })
    },
    handleCheckBoxChange(value) {
      if (value) {
        // 我负责的房间统计信息
        this.roomCountDTO.chargerPersonId = this.$store.getters.userInfo.id;
      } else {
        this.roomCountDTO.chargerPersonId = null;
      }
      this.getCountData()
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 20px;
}
</style>
