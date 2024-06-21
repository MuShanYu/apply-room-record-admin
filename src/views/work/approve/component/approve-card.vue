<template>
  <div class="card-container">
    <div class="card-wrap">
      <!-- tag -->
      <div class="card-tag-position">
        <el-tag size="small" :type="roomReservation.state | statusFilter">{{ roomReservation.state | msgFilter }}</el-tag>
      </div>
      <!--header-->
      <div class="card-title">
        <div style="font-weight: bold;font-size: 16px;">
          {{ roomReservation.roomName }}
        </div>
        <div style="color: #909399;font-size: 13px;">
          {{ roomReservation.createTime | parseTime('{y}年{m}月{d}日 {h}:{i}') }}
        </div>
      </div>
      <div class="card-time">
        预约时间：{{ roomReservation.reserveStartTime | parseTime('{y}年{m}月{d}日 {h}:{i}') }}~{{ roomReservation.reserveEndTime | parseTime('{h}:{i}') }}
      </div>
      <!--body-->
      <div style="margin-bottom: 15px;">
        <div class="card-reason">
          申请理由：{{ roomReservation.roomUsage }}
        </div>
        <div class="card-tip">
          <div>
            <i class="el-icon-postcard"></i> {{ roomReservation.stuNum }}
          </div>
          <div>
            <i class="el-icon-user"></i> {{ roomReservation.name }}
          </div>
          <div>
            <i class="el-icon-location-outline"></i> {{ roomReservation.teachBuilding }}
          </div>
        </div>

      </div>
      <!--footer-->
      <div v-if="roomReservation.state !== 0 && (roomReservation.remark !== null && roomReservation.remark.length > 0)" style="font-size: 14px;color: #909399;">
        备注： {{roomReservation.remark === '' ? '无' : roomReservation.remark}}
      </div>
      <div style="margin-top: 15px;text-align: right;">
        <el-button @click="handleRoomReservationPassClick"
                   :disabled="passBtn"
                   style="margin-right: 5px;" type="primary" size="mini">通过
        </el-button>
        <el-button style="margin-right: 5px;" @click="handleRoomUpdateRejectClick"
                   :disabled="rejectBtn"
                   type="danger" size="mini">拒绝
        </el-button>
        <el-button @click="handleRoomRecordDel" icon="el-icon-delete" type="text"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
const statusMap = {
  notReviewed: {
    status: 'primary',
    msg: '待审批'
  },
  ban: {
    status: 'danger',
    msg: '驳回'
  },
  reviewed: {
    status: 'success',
    msg: '已审批'
  },
  userCanceled: {
    status: 'info',
    msg: '用户取消'
  },
  timeOut: {
    status: 'warning',
    msg: '超时未处理'
  }
}
export default {
  name: "approve-card",
  props: {
    roomReservation: {
      type: Object,
      default() {
        return {}
      }
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  computed: {
    passBtn() {
      let isTimeout = false
      if (this.currentTime > this.roomReservation.reserveEndTime) {
        isTimeout = true
      }
      return this.roomReservation.state !== 0  || isTimeout
    },
    rejectBtn() {
      let isTimeout = false
      if (this.currentTime > this.roomReservation.reserveEndTime) {
        isTimeout = true
      }
      return this.roomReservation.state !== 0 || isTimeout
    }
  },
  filters: {
    msgFilter(status) {
      switch (status) {
        case 0:
          return statusMap.notReviewed.msg
        case 1:
          return statusMap.reviewed.msg
        case 2:
          return statusMap.userCanceled.msg
        case 3:
          return statusMap.ban.msg
        case 4:
          return statusMap.timeOut.msg
      }
    },
    statusFilter(status) {
      switch (status) {
        case 0:
          return statusMap.notReviewed.status
        case 1:
          return statusMap.reviewed.status
        case 2:
          return statusMap.userCanceled.status
        case 3:
          return statusMap.ban.status
        case 4:
          return statusMap.timeOut.status
      }
    },
  },
  methods: {
    handleRoomReservationPassClick() {
      this.$emit("roomReservationPassClick")
    },
    handleRoomUpdateRejectClick() {
      this.$emit("roomUpdateRejectClick")
    },
    handleRoomRecordDel() {
      this.$emit("roomRecordDelClick")
    }
  }
}
</script>

<style scoped>
.card-container {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 8px;
  position: relative;
  margin-bottom: 30px;
  background-color: #ffffff;
}

.card-wrap {
  padding: 15px;
  line-height: 1.5;
}

.card-title {
  word-break: break-all;
  margin-top: 20px;
  color: #303133;
  margin-bottom: 15px;
  text-align: center;
  display: flex;
  justify-content: space-between;
}

.card-tip {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #909399;
  margin-top: 15px;
}

.card-reason {
  margin-top: 15px;
  word-break: break-all;
  font-size: 14px;
  color: #909399;
}

.card-tag-position {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 13px;
  color: #909399;
}

.card-time {
  font-size: 14px;
  color: #303133;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}
</style>
