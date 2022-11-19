<template>
  <div v-loading="listLoading" class="app-container" id="room-approve-container">
    <div style="text-align: center; border: 1px solid #dcdfe6;padding-top: 10px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);" :style="fixedHeader ? 'margin-top: 35px;' : ''"
         class="filter-container">
      <el-select clearable @change="getRoomReservationReviewedList" style="margin-right: 30px;width: 250px;"
                 v-model="query.school" placeholder="请选择校区">
        <el-option
          v-for="(item, index) in school"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomReservationReviewedList" style="margin-right: 30px;width: 250px;"
                 v-model="query.teachBuilding" placeholder="请选择楼栋">
        <el-option
          v-for="(item, index) in teachBuilding"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomReservationReviewedList" style="width: 250px;"
                 v-model="query.category" placeholder="请选择类别">
        <el-option
          v-for="(item, index) in category"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
      <div v-for="(item, index) in roomList" :key="item.id" class="card-container">
        <!-- tag -->
        <div class="card-tag-position">
          <div class="card-tag">{{ item.state | msgFilter }}</div>
        </div>
        <!--header-->
        <div class="card-title">
          {{ item.createTime | parseTime }} {{ item.name }}的{{ item.roomName }}预约申请
        </div>
        <!--body-->
        <div style="margin-bottom: 15px;">
          <div class="card-tip">
            <div>
              {{ item.school }}
            </div>
            <div>
              {{ item.teachBuilding }}
            </div>
            <div>
              {{ item.category }}
            </div>
          </div>
          <div class="card-reason">
            申请理由：{{ item.roomUsage }}
          </div>
        </div>
        <!--footer-->
        <div class="card-time">
          <div>
            预约起始时间：{{ item.reserveEndTime | parseTime }}
          </div>
          <div>
            预约结束时间：{{ item.reserveEndTime | parseTime }}
          </div>
        </div>
        <div style="margin-top: 15px;text-align: right;">
          <el-button @click="handleRoomReservationPassClick(item, index)" :disabled="item.state === 2 || item.state === 3 || item.state === 6"
                     style="margin-right: 5px;" type="primary" size="mini">通过</el-button>
          <el-button style="margin-right: 5px;" @click="handleRoomUpdateRejectClick(item, index)" :disabled="item.state === 4 || item.state === 3 || item.state === 6"
                     type="danger" size="mini">拒绝</el-button>
          <el-button @click="handleRoomRecordDel(item.id, index)" icon="el-icon-delete" type="text"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import roomApi from '@/api/room'
import dataStatistics from "@/api/data-statistics";

import Pagination from "@/components/Pagination";
import {mapState} from "vuex";

const statusMap = {
  notReviewed: {
    status: 'warning',
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
    status: 'info',
    msg: '超时未处理'
  }
}
export default {
  name: "RoomApprove",
  components: {
    Pagination
  },
  computed: {
    ...mapState({
      fixedHeader: state => state.settings.fixedHeader
    })
  },
  filters: {
    msgFilter(status) {
      switch (status) {
        case 4:
          return statusMap.ban.msg
        case 0:
          return statusMap.notReviewed.msg
        case 3:
          return statusMap.userCanceled.msg
        case 2:
          return statusMap.reviewed.msg
        case 6:
          return statusMap.timeOut.msg
      }
    },
  },
  data() {
    return {
      // 查询相关参数
      query: {
        page: 1,
        size: 10,
        teachBuilding: '',
        school: '',
        category: ''
      },
      listLoading: false,
      roomList: [],
      total: 0,
      teachBuilding: [],
      school: [],
      category: [],
      currentRoom: {},
      filters: [
        {text: '待审批', value: 0},
        {text: '已审批', value: 2},
        {text: '驳回', value: 4},
        {text: '用户取消', value: 3},
        {text: '超时未处理', value: 6}
      ]
    }
  },
  created() {
    this.getRoomReservationReviewedList()
    this.getRoomClassifyInfo()
  },
  methods: {
    getRoomReservationReviewedList() {
      this.listLoading = true
      roomApi.userRoomReservationReviewed(this.query).then(data => {
        this.roomList = data.pageData
        this.total = data.totalSize
        this.listLoading = false
        this.roomList.forEach(item => this.$set(item, "detailBtnLoading", false))
        console.log(this.roomList);
      }).catch(e => {
        this.listLoading = false
      })
    },
    getRoomClassifyInfo() {
      dataStatistics.getRoomClassifyInfo().then(data => {
        this.category = data.categories
        this.school = data.schools
        this.teachBuilding = data.teachBuildings
      })
    },
    handleRoomReservationPassClick(item, index) {
      this.$confirm('确定要通过该房间预约吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        roomApi.passOrRejectRoomReserve(item.id, true).then(() => {
          item.state = 2
          this.listLoading = false
          this.$message.success('操作成功')
        })
      }).catch(() => {

      })
    },
    handleRoomUpdateRejectClick(item, index) {
      this.$confirm('确定要驳回该房间预约吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        roomApi.passOrRejectRoomReserve(item.id, false).then(() => {
          item.state = 4
          this.listLoading = false
          this.$message.success('操作成功')
        })
      }).catch(() => {

      })
    },
    handleRoomRecordDel(id, index) {
      this.$confirm('确定要永久删除该房间预约记录吗?这会导致对应的预约人查看不到自己的该条预约记录。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        roomApi.delRoomReservationRecord(id).then(() => {
          this.roomList.splice(index, 1)
          this.listLoading = false
          this.$message.success('删除成功')
        })
      }).catch((e) => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
#room-approve-container {
  /*padding: 32px;*/
  /*background-color: #f1f1f1;*/
  /*position: relative;*/
  /*height: 100vh;*/
}

.card-container {
  border: 1px solid #dcdfe6;
  margin: 15px;
  width: 480px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.card-title {
  margin-top: 12px;
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

.card-tag {
  font-size: 13px;
  border: 1px solid #409EFF;
  padding: 2px;
  border-radius: 4px;
}

</style>
