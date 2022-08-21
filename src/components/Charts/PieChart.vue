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
          text: '房间预约总次数统计',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
            color: '#909399'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['已预约次数', '已取消次数', '已审批次数', '已驳回次数']
        },
        series: [
          {
            name: '总次数统计',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: reviewTimesCount, name: '已预约次数' },
              { value: cancelTimesCount, name: '已取消次数' },
              { value: reviewedTimesCount, name: '已审批次数' },
              { value: rejectTimesCount, name: '已驳回次数' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
