<template>
  <div class="card-container">
    <!-- tag -->
    <div class="card-tag-position">
      <el-tag :type="room.state | colorFilter">{{ room.state | msgFilter }}</el-tag>
    </div>
    <!--header-->
    <div class="card-title">
      {{ room.name }}的{{ room.roomName }}预约申请({{ room.createTime | parseTime }})
    </div>
    <!--body-->
    <div style="margin-bottom: 15px;">
      <div class="card-tip">
        <div>
          {{ room.school }}
        </div>
        <div>
          {{ room.teachBuilding }}
        </div>
        <div>
          {{ room.category }}
        </div>
      </div>
      <div class="card-reason">
        申请理由：{{ room.roomUsage }}
      </div>
    </div>
    <!--footer-->
    <div class="card-time">
      <div>
        预约起始时间：{{ room.reserveStartTime | parseTime }}
      </div>
      <div>
        预约结束时间：{{ room.reserveEndTime | parseTime }}
      </div>
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
</template>

<script>
const statusMap = {
  notReviewed: {
    status: '',
    msg: '待审批'
  },
  rejected: {
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
    msg: '未处理'
  }
}
export default {
  name: "approve-card",
  props: {
    room: {
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
      if (this.currentTime > this.room.reserveEndTime) {
        isTimeout = true
      }
      return this.room.state === 1 || this.room.state === 2 || this.room.state === 4 || isTimeout
    },
    rejectBtn() {
      let isTimeout = false
      if (this.currentTime > this.room.reserveEndTime) {
        isTimeout = true
      }
      return this.room.state === 2 || this.room.state === 3 || this.room.state === 4 || isTimeout
    }
  },
  filters: {
    msgFilter(status) {
      switch (status) {
        case 3:
          return statusMap.rejected.msg
        case 0:
          return statusMap.notReviewed.msg
        case 2:
          return statusMap.userCanceled.msg
        case 1:
          return statusMap.reviewed.msg
        case 4:
          return statusMap.timeOut.msg
      }
    },
    colorFilter(status) {
      switch (status) {
        case 3:
          return statusMap.rejected.status
        case 0:
          return statusMap.notReviewed.status
        case 2:
          return statusMap.userCanceled.status
        case 1:
          return statusMap.reviewed.status
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
  margin: 15px;
  width: 480px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.card-title {
  word-break: break-all;
  margin-top: 20px;
  font-size: 16px;
  color: #303133;
  margin-bottom: 15px;
  text-align: center;
}

.card-tip {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.card-reason {
  margin-top: 15px;
  word-break: break-all;
  font-size: 14px;
  color: #606266;
}

.card-tag-position {
  position: absolute;
  right: 0;
  top: 0;
  padding: 3px;
  font-size: 13px;
  color: #606266;
}

.card-time {
  font-size: 12px;
  color: #909399;
  display: flex;
  justify-content: space-between;
}
</style>
