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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null
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
    setOptions({ rejectTimes, canceledTimes, reviewTimes, reviewedTimes, dates } = {}) {
      this.chart.setOption({
        title: {
          text: '房间预约次数统计',
          left: 'center'
        },
        xAxis: {
          data: dates,
          boundaryGap: false,
          axisTick: {
            show: false
          }
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
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          name: '预约次数'
        },
        legend: {
          data: ['已预约','已通过', '已驳回', '已取消'],
          top: 50
        },
        series: [
          {
            name: '已预约',
            smooth: true,
            type: 'line',
            data: reviewTimes,
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
            itemStyle: {
              color: '#409EFF'
            },
            lineStyle: {
              color: '#409EFF'
            }
          },
          {
            name: '已通过',
            smooth: true,
            type: 'line',
            data: reviewedTimes,
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
            itemStyle: {
              color: '#67c23a'
            },
            lineStyle: {
              color: '#67c23a'
            }
          },
          {
            name: '已驳回',
            smooth: true,
            type: 'line',
            data: rejectTimes,
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
            itemStyle: {
              color: '#db3233'
            },
            lineStyle: {
              color: '#db3233'
            }
          },
          {
            name: '已取消',
            smooth: true,
            type: 'line',
            data: canceledTimes,
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
            itemStyle: {
              color: '#909399'
            },
            lineStyle: {
              color: '#909399'
            }
          }
        ]
      })
    }
  }
}
</script>
