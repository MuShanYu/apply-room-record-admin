<template>
  <div class="app-container" id="room-approve-container">
    <div :style="fixedHeader ? 'margin-top: 35px;' : ''"
         class="filter-container">
      <el-select clearable @change="handleTimeChange" style="margin-right: 30px;width: 250px;"
                 v-model="timeOption" placeholder="快捷时间过滤">
        <el-option
          label="今天"
          key="1"
          value="today">
        </el-option>
        <el-option
          label="明天"
          key="2"
          value="tomorrow">
        </el-option>
        <el-option
          label="后天"
          key="3"
          value="afterTomorrow">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomReservationList" style="margin-right: 30px;width: 250px;"
                 v-model="query.school" placeholder="请选择校区">
        <el-option
          v-for="(item, index) in school"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomReservationList" style="margin-right: 30px;width: 250px;"
                 v-model="query.teachBuilding" placeholder="请选择楼栋">
        <el-option
          v-for="(item, index) in teachBuilding"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-select clearable @change="getRoomReservationList" style="width: 250px;"
                 v-model="query.category" placeholder="请选择类别">
        <el-option
          v-for="(item, index) in category"
          :label="item"
          :key="index"
          :value="item">
        </el-option>
      </el-select>
      <el-tooltip effect="light" content="刷新数据" placement="top-start">
        <el-button @click="refreshData" type="text" style="margin-left: 15px;"><i class="el-icon-refresh"></i>
        </el-button>
      </el-tooltip>
    </div>
    <div>
      <el-tabs v-model="activeState" @tab-click="handleTabClick">
        <el-tab-pane v-loading="tabReviewLoading" label="待审批" name="0">
          <div style="display: flex;flex-wrap: wrap;">
            <el-empty v-if="roomReviewList.length === 0" :image-size="320" :image="config.emptyImg"
                      description="暂无待审批申请"></el-empty>
            <approve-card :current-time="currentTime" id="review" v-else v-for="(item, index) in roomReviewList"
                          @roomReservationPassClick="handleRoomReservationPassClick(item, index)"
                          @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
                          @roomRecordDelClick="handleRoomRecordDel(item, index)"
                          :roomReservation="item" :key="item.id"/>
          </div>
        </el-tab-pane>
        <el-tab-pane v-loading="tabReviewedLoading" label="已审批" name="1">
          <div style="display: flex;flex-wrap: wrap;">
            <el-empty v-if="roomReviewedList.length === 0" :image-size="320" :image="config.emptyImg"
                      description="暂无已审批申请"></el-empty>
            <approve-card :current-time="currentTime" id="reviewed" v-else v-for="(item, index) in roomReviewedList"
                          @roomReservationPassClick="handleRoomReservationPassClick(item, index)"
                          @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
                          @roomRecordDelClick="handleRoomRecordDel(item, index)"
                          :roomReservation="item" :key="item.id"/>
          </div>
        </el-tab-pane>
        <el-tab-pane v-loading="tabRejectLoading" label="已驳回" name="3">
          <div style="display: flex;flex-wrap: wrap;">
            <el-empty v-if="roomRejectList.length === 0" :image-size="320" :image="config.emptyImg"
                      description="暂无已驳回申请"></el-empty>
            <approve-card :current-time="currentTime" id="reject" v-else v-for="(item, index) in roomRejectList"
                          @roomReservationPassClick="handleRoomReservationPassClick(item, index)"
                          @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
                          @roomRecordDelClick="handleRoomRecordDel(item, index)"
                          :roomReservation="item" :key="item.id"/>
          </div>
        </el-tab-pane>
        <el-tab-pane v-loading="tabCancelLoading" label="用户已取消" name="2">
          <div style="display: flex;flex-wrap: wrap;">
            <el-empty v-if="roomCancelList.length === 0" :image-size="320" :image="config.emptyImg"
                      description="暂无已驳回申请"></el-empty>
            <approve-card :current-time="currentTime" id="cancel" v-else v-for="(item, index) in roomCancelList"
                          @roomReservationPassClick="handleRoomReservationPassClick(item, index)"
                          @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
                          @roomRecordDelClick="handleRoomRecordDel(item, index)"
                          :roomReservation="item" :key="item.id"/>
          </div>
        </el-tab-pane>
        <el-tab-pane v-loading="tabTimeoutLoading" label="超时未处理" name="4">
          <div style="display: flex;flex-wrap: wrap;">
            <el-empty v-if="roomTimeoutList.length === 0" :image-size="320" :image="config.emptyImg"
                      description="暂无已驳回申请"></el-empty>
            <approve-card :current-time="currentTime" id="timeout" v-else v-for="(item, index) in roomTimeoutList"
                          @roomReservationPassClick="handleRoomReservationPassClick(item, index)"
                          @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
                          @roomRecordDelClick="handleRoomRecordDel(item, index)"
                          :roomReservation="item" :key="item.id"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="确定要驳回该条预约申请吗?" :visible.sync="rejectDialog">
      <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="驳回原因" prop="reason">
            <el-input autosize placeholder="请填写驳回原因" type="textarea" v-model="form.reason"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialog = false">取 消</el-button>
        <el-button :loading="rejectBtnLoading" type="primary" @click="confirmReject">确 定</el-button>
      </div>
    </el-dialog>
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getRoomReservationList"/>
    </div>
  </div>
</template>

<script>
import roomApi from '@/api/room'
import dataStatistics from "@/api/data-statistics";

import Pagination from "@/components/Pagination";
import ApproveCard from "./component/approve-card.vue";
import {mapState} from "vuex";
import config from "@/common/sys-config";

import {getTime} from '@/utils'
import da from "element-ui/src/locale/lang/da";

export default {
  name: "RoomApprove",
  components: {
    Pagination,
    ApproveCard
  },
  computed: {
    ...mapState({
      fixedHeader: state => state.settings.fixedHeader
    }),
    config() {
      return config
    }
  },
  data() {
    return {
      // 查询相关参数
      query: {
        page: 1,
        size: 10,
        teachBuilding: '',
        school: '',
        category: '',
        state: 0,
        startTime: null,
        endTime: null
      },
      timeOption: '',
      tabReviewLoading: false,
      tabReviewedLoading: false,
      tabRejectLoading: false,
      tabCancelLoading: false,
      tabTimeoutLoading: false,
      roomReviewList: [],
      roomReviewedList: [],
      roomRejectList: [],
      roomCancelList: [],
      roomTimeoutList: [],
      total: 0,
      teachBuilding: [],
      school: [],
      category: [],
      currentRoom: {},
      activeState: '0',
      currentTime: new Date().getTime(),
      rejectDialog: false,
      currentRejectItem: {},
      rejectBtnLoading: false,
      form: {
        reason: ''
      },
      rules: {
        reason: [
          { required: true, message: '请填写驳回原因', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.getRoomReservationList()
    this.getRoomClassifyInfo()
  },
  mounted() {
    this.$notify({
      title: '提示',
      type: 'warning',
      dangerouslyUseHTMLString: true,
      message: '您可以在小程序-房间预约与流动统计中，方便进行房间预约审核。<span style="color: red;">超过预约结束时间的申请管理员只能进行删除操作，不能进行通过或者拒绝操作。</span>',
      duration: 8000
    });
  },
  methods: {
    getRoomReservationList() {
      this.tabLoading(this.query.state, true)
      roomApi.userRoomReservationReviewed(this.query).then(data => {
        this.assignmentRightRoomList(data.pageData, this.query.state)
        this.total = data.totalSize
        this.tabLoading(this.query.state, false)
        // console.log(data.pageData);
      }).catch(e => {
        this.tabLoading(this.query.state, false)
      })
    },
    getRoomClassifyInfo() {
      dataStatistics.getRoomClassifyInfo().then(data => {
        this.category = data.categories
        this.school = data.schools
        this.teachBuilding = data.teachBuildings
      })
    },
    handleTimeChange(e) {
      let dateTimeStamp = getTime(e)
      this.query.page = 1
      this.query.startTime = dateTimeStamp[0]
      this.query.endTime = dateTimeStamp[1]
      this.getRoomReservationList()
    },
    handleRoomReservationPassClick(item, index) {
      this.$confirm('确定要通过该房间预约吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tabLoading(this.query.state, true)
        roomApi.passOrRejectRoomReserve(item.id, true, "符合要求，给予通过").then(() => {
          this.getRoomReservationList()
          this.$message.success('审核成功结果已用邮件方式通知申请人')
        }).catch(() => {
          this.tabLoading(this.query.state, false)
        })
      }).catch(() => {

      })
    },
    handleRoomUpdateRejectClick(item, index) {
      this.rejectDialog = true
      this.currentRejectItem = Object.assign({}, item)
    },
    confirmReject() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.rejectBtnLoading = true
          roomApi.passOrRejectRoomReserve(this.currentRejectItem.id, false, this.form.reason).then(() => {
            this.getRoomReservationList()
            this.form.reason = ''
            this.$refs.form.resetFields()
            this.rejectBtnLoading = false
            this.rejectDialog = false
            this.$message.success('审核驳回结果已用邮件方式通知申请人')
          }).catch(() => {
            this.tabLoading(this.query.state, false)
          })
        } else {
          this.$message.error('请填写驳回原因后点击确定')
          return false;
        }
      });
    },
    handleRoomRecordDel(id, index) {
      this.$confirm('确定要永久删除该房间预约记录吗?这会导致对应的预约人查看不到自己的该条预约记录。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tabLoading(this.query.state, true)
        roomApi.delRoomReservationRecord(id).then(() => {
          // 刷新
          this.getRoomReservationList()
          this.$message.success('删除成功')
        }).catch(() => {
          this.tabLoading(this.query.state, false)
        })
      }).catch((e) => {

      })
    },
    refreshData() {
      this.query.page = 1
      this.getRoomReservationList()
    },
    handleTabClick(tab, event) {
      this.query.page = 1
      this.query.state = Number(tab.name)
      this.currentTime = new Date().getTime()
      this.getRoomReservationList()
    },
    tabLoading(state, start) {
      let that = this
      switch (state) {
        case 0:
          that.tabReviewLoading = start;
          break
        case 1:
          that.tabReviewedLoading = start
          break
        case 2:
          that.tabCancelLoading = start
          break
        case 3:
          that.tabRejectLoading = start
          break
        case 4:
          that.tabTimeoutLoading = start
          break
      }
    },
    assignmentRightRoomList(roomList, state) {
      let that = this
      switch (state) {
        case 0:
          that.roomReviewList = roomList
          break
        case 1:
          that.roomReviewedList = roomList
          break
        case 2:
          that.roomCancelList = roomList
          break
        case 3:
          that.roomRejectList = roomList
          break
        case 4:
          that.roomTimeoutList = roomList
          break
      }
    }
  }
}
</script>

<style scoped>

</style>
