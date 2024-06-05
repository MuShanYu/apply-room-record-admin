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
    setOptions({rejectTimesCount, cancelTimesCount, reviewTimesCount, reviewedTimesCount} = {}) {
      this.chart.setOption({
        title: {
          text: '房间预约次数统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '总次数',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: reviewTimesCount, name: '已预约次数' },
              { value: reviewedTimesCount, name: '已通过次数' },
              { value: rejectTimesCount, name: '已驳回次数' },
              { value: cancelTimesCount, name: '已取消次数' }
            ],
            itemStyle: {
              normal: {
                color: function(params) {
                  let colorList = [
                    '#409eff',
                    '#67c23a',
                    '#ee6666',
                    '#909399'
                  ];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>
