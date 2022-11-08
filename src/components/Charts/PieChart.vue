<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
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
      default: '450px'
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
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({rejectTimesCount, cancelTimesCount, reviewTimesCount, reviewedTimesCount} = {}) {
      this.chart.setOption({
        title: {
          text: '房间预约总次数统计(所指定的时间跨度内)',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
            color: '#909399'
          }
        },
        xAxis: {
          max: 'dataMax'
        },
        yAxis: {
          type: 'category',
          data: ['已预约总次数', '已取消总次数', '已通过总次数', '已驳回总次数'],
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 3 // only the largest 3 bars will be displayed
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        series: [
          {
            name: '总次数',
            type: 'bar',
            data: [reviewTimesCount, cancelTimesCount, reviewedTimesCount, rejectTimesCount],
            label: {
              show: true,
              position: 'right',
              valueAnimation: true
            }
          }
        ],
        legend: {
          show: true
        },
        animationDuration: 2000,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
      })
    }
  }
}
</script>
