<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions({dates, totalEntryAndOutPeople, entryTimes, outTimes} = {}) {
      this.chart.setOption({
        title: {
          text: '房间人员进出统计'
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 80,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['进出总数', '进入次数', '离开次数']
        },
        xAxis: [
          {
            type: 'category',
            data: dates,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '离开/进入次数'
          },
          {
            type: 'value',
            name: '进出人数'
          }
        ],
        series: [
          {
            name: '进入次数',
            type: 'bar',
            data: entryTimes,
            itemStyle: {
              color: '#5470c6'  // 设置进入次数的颜色
            }
          },
          {
            name: '离开次数',
            type: 'bar',
            data: outTimes,
            itemStyle: {
              color: '#67c23a'  // 设置进入次数的颜色
            }
          },
          {
            name: '进出总数',
            type: 'line',
            yAxisIndex: 1,
            data: totalEntryAndOutPeople,
            itemStyle: {
              color: '#fac858'  // 设置进出总数的颜色
            },
            lineStyle: {
              color: '#fac858'  // 设置线条的颜色，防止线条和点颜色不一致
            }
          }
        ]
      })
    }
  }
}
</script>
