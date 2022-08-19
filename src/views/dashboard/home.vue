<template>
  <div class="home-container">
    <div>
      <panel-group/>
    </div>
    <div style="margin-bottom: 10px;background: #ffffff;padding: 10px;" class="">
      <el-date-picker
        :clearable="false"
        v-model="roomReserveQuery.startTime"
        type="datetime"
        value-format="timestamp"
        placeholder="选择起始日期">
      </el-date-picker>
      <el-select style="margin-left: 10px;" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
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
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      roomReserveQuery: {
        roomId: '',
        startTime: new Date().getTime()
      },
      roomReserveData: {}
    }
  },
  created() {
    this.getRoomReservationCount()
  },
  methods: {
    getRoomReservationCount() {
      console.log(this.roomReserveQuery);
      dataStatistics.countRoomReservationTimes(
        this.roomReserveQuery.roomId,
        this.roomReserveQuery.startTime).then(data => {
        this.roomReserveData = data
        console.log(data);
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
