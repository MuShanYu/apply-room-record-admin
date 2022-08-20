<template>
  <div class="home-container">
    <div>
      <panel-group :count-data="countData" />
    </div>
    <div style="margin-bottom: 10px;background: #ffffff;padding: 10px;" class="">
      <el-date-picker
        :clearable="false"
        v-model="query.startTime"
        type="datetime"
        value-format="timestamp"
        placeholder="选择起始日期">
      </el-date-picker>
      <el-select style="margin-left: 10px;"
                 v-model="roomName"
                 filterable
                 remote
                 reserve-keyword
                 placeholder="请输入关键词"
                 :remote-method="getRoomName"
                 :loading="selectLoading">
        <el-option
          v-for="item in roomOptions"
          :key="item.id"
          :label="item.roomName"
          :value="item.id">
        </el-option>
      </el-select>
      <span style="color: #303133;font-size: 12px;margin-left: 10px;">
        （均为七天数据）（通过改变条件查看对应统计图表）
      </span>
      <span style="color: #303133;font-size: 12px;">
        （说明:一天是指从00:00:00~24:00:00）
      </span>
      <span style="color: #909399;font-size: 12px;">
          以下是房间预约和人员流动情况统计图表
      </span>
    </div>

    <div class="chart-wrapper">
      <line-chart :class-name="'line-chart'"/>
    </div>

    <div class="chart-wrapper">
      <line-marker :id="'line-marker'" :width="'100%'" :height="'400px'"/>
    </div>
    <div>
      <el-row :gutter="30">
        <el-col :span="12">
          <div class="chart-wrapper">
            <pie-chart :class-name="'pie-chart'"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrapper">
            <bar-chart :class-name="'bar-chart'"/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import dataStatistics from "@/api/data-statistics";

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
      query: {
        roomId: '',
        startTime: new Date().getTime()
      },
      roomReserveData: {},
      countData: {
        accessRecordCount: 0,
        roomCount: 0,
        roomReserveReviewed: 0,
        userCount: 0
      },
      selectLoading: false,
    }
  },
  created() {
    this.getCount()
    this.getSystemCountInfo()
  },
  methods: {
    getCount() {
      dataStatistics.countRoomReservationTimes(this.query).then(data => {
        this.roomReserveData = data
        console.log(data, '预约记录');
      })
      dataStatistics.countAccessRecordApi(this.query).then(data => {
        console.log(data, '进出记录');
      })
    },
    getSystemCountInfo() {
      dataStatistics.getSystemCount().then(data => {
        this.countData = data.countData
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
