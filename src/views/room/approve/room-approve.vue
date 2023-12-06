<template>
  <div class="app-container" id="room-approve-container">
    <div
      :style="fixedHeader ? 'margin-top: 35px;' : ''"
      class="filter-container"
    >
      <el-select
        clearable
        @change="getRoomReservationReviewedList"
        style="margin-right: 30px; width: 250px"
        v-model="query.school"
        placeholder="请选择校区"
      >
        <el-option
          v-for="(item, index) in school"
          :label="item"
          :key="index"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-select
        clearable
        @change="getRoomReservationReviewedList"
        style="margin-right: 30px; width: 250px"
        v-model="query.teachBuilding"
        placeholder="请选择楼栋"
      >
        <el-option
          v-for="(item, index) in teachBuilding"
          :label="item"
          :key="index"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-select
        clearable
        @change="getRoomReservationReviewedList"
        style="margin-right: 30px; width: 250px"
        v-model="query.category"
        placeholder="请选择类别"
      >
        <el-option
          v-for="(item, index) in category"
          :label="item"
          :key="index"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-tooltip effect="light" content="刷新数据" placement="top-start">
        <el-button @click="refreshData" type="text"
          ><i class="el-icon-refresh"></i>
        </el-button>
      </el-tooltip>
    </div>
    <div>
      <el-tabs v-model="activeState" @tab-click="handleTabClick">
        <el-tab-pane v-loading="tabReviewLoading" label="待审批" name="0">
          <div style="margin-top: 10px; margin-bottom: 10px">
            <el-checkbox-group v-model="reviewDate" @change="handleDayChange">
              <el-checkbox style="margin-right: 30px" label="1" border
                >今天预约</el-checkbox
              >
              <el-checkbox style="margin-right: 30px" label="2" border
                >明天预约</el-checkbox
              >
              <el-checkbox style="margin-right: 30px" label="3" border
                >后天预约</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <div
            style="
              display: flex;
              flex-wrap: wrap;
              justify-content: space-around;
            "
          >
            <el-empty
              v-if="roomReviewList.length === 0"
              :image-size="320"
              :image="config.emptyImg"
              description="暂无待审批申请"
            ></el-empty>
            <approve-card
              :current-time="currentTime"
              id="review"
              v-else
              v-for="(item, index) in roomReviewList"
              @roomReservationPassClick="
                handleRoomReservationPassClick(item, index)
              "
              @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
              @roomRecordDelClick="handleRoomRecordDel(item, index)"
              :room="item"
              :key="item.id"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane v-loading="tabReviewedLoading" label="已审批" name="2">
          <div
            style="
              margin-top: 10px;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
            "
          >
            <el-checkbox
              style="margin-right: 30px"
              v-model="overtime"
              @change="handleDayChange"
              label="过滤超时"
              border
            ></el-checkbox>
            <el-checkbox-group v-model="reviewedDate" @change="handleDayChange">
              <el-checkbox style="margin-right: 30px" label="1" border
                >今天预约</el-checkbox
              >
              <el-checkbox style="margin-right: 30px" label="2" border
                >明天预约</el-checkbox
              >
              <el-checkbox style="margin-right: 30px" label="3" border
                >后天预约</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <div
            style="
              display: flex;
              flex-wrap: wrap;
              justify-content: space-around;
            "
          >
            <el-empty
              v-if="roomReviewedList.length === 0"
              :image-size="320"
              :image="config.emptyImg"
              description="暂无已审批申请"
            ></el-empty>
            <approve-card
              :current-time="currentTime"
              id="reviewed"
              v-else
              v-for="(item, index) in roomReviewedList"
              @roomReservationPassClick="
                handleRoomReservationPassClick(item, index)
              "
              @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
              @roomRecordDelClick="handleRoomRecordDel(item, index)"
              :room="item"
              :key="item.id"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane v-loading="tabRejectLoading" label="已驳回" name="4">
          <div
            style="
              display: flex;
              flex-wrap: wrap;
              justify-content: space-around;
            "
          >
            <el-empty
              v-if="roomRejectList.length === 0"
              :image-size="320"
              :image="config.emptyImg"
              description="暂无已驳回申请"
            ></el-empty>
            <approve-card
              :current-time="currentTime"
              id="reject"
              v-else
              v-for="(item, index) in roomRejectList"
              @roomReservationPassClick="
                handleRoomReservationPassClick(item, index)
              "
              @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
              @roomRecordDelClick="handleRoomRecordDel(item, index)"
              :room="item"
              :key="item.id"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane v-loading="tabCancelLoading" label="用户已取消" name="3">
          <div
            style="
              display: flex;
              flex-wrap: wrap;
              justify-content: space-around;
            "
          >
            <el-empty
              v-if="roomCancelList.length === 0"
              :image-size="320"
              :image="config.emptyImg"
              description="暂无已驳回申请"
            ></el-empty>
            <approve-card
              :current-time="currentTime"
              id="cancel"
              v-else
              v-for="(item, index) in roomCancelList"
              @roomReservationPassClick="
                handleRoomReservationPassClick(item, index)
              "
              @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
              @roomRecordDelClick="handleRoomRecordDel(item, index)"
              :room="item"
              :key="item.id"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane v-loading="tabTimeoutLoading" label="超时未处理" name="6">
          <div
            style="
              display: flex;
              flex-wrap: wrap;
              justify-content: space-around;
            "
          >
            <el-empty
              v-if="roomTimeoutList.length === 0"
              :image-size="320"
              :image="config.emptyImg"
              description="暂无已驳回申请"
            ></el-empty>
            <approve-card
              :current-time="currentTime"
              id="timeout"
              v-else
              v-for="(item, index) in roomTimeoutList"
              @roomReservationPassClick="
                handleRoomReservationPassClick(item, index)
              "
              @roomUpdateRejectClick="handleRoomUpdateRejectClick(item, index)"
              @roomRecordDelClick="handleRoomRecordDel(item, index)"
              :room="item"
              :key="item.id"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="确定要驳回该条预约申请吗?" :visible.sync="rejectDialog">
      <div>
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="驳回原因" prop="rejectReason">
            <el-input
              autosize
              placeholder="请填写驳回原因"
              type="textarea"
              v-model="form.rejectReason"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialog = false">取 消</el-button>
        <el-button
          :loading="rejectBtnLoading"
          type="primary"
          @click="confirmReject"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.size"
        @pagination="getRoomReservationReviewedList"
      />
    </div>
  </div>
</template>

<script>
import roomApi from "@/api/room";
import dataStatistics from "@/api/data-statistics";

import Pagination from "@/components/Pagination";
import ApproveCard from "./component/approve-card.vue";
import { mapState } from "vuex";
import config from "@/common/sys-config";

export default {
  name: "RoomApprove",
  components: {
    Pagination,
    ApproveCard,
  },
  computed: {
    ...mapState({
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    config() {
      return config;
    },
  },
  data() {
    return {
      // 查询相关参数
      query: {
        page: 1,
        size: 10,
        teachBuilding: "",
        school: "",
        category: "",
        state: "0",
      },
      tabReviewLoading: false,
      tabReviewedLoading: false,
      tabRejectLoading: false,
      tabCancelLoading: false,
      tabTimeoutLoading: false,
      overtime: false,
      reviewDate: [],
      reviewedDate: [],
      cacheRoomList: [],
      roomReviewList: [],
      roomReviewedList: [],
      roomRejectList: [],
      roomCancelList: [],
      roomTimeoutList: [],
      todayRoomList: [],
      yesterdayRoomList: [],
      total: 0,
      teachBuilding: [],
      school: [],
      category: [],
      currentRoom: {},
      activeState: "0",
      currentTime: new Date().getTime(),
      now: new Date().getTime(),
      rejectDialog: false,
      currentRejectItem: {},
      rejectBtnLoading: false,
      form: {
        rejectReason: "",
      },
      rules: {
        rejectReason: [
          { required: true, message: "请填写驳回原因", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRoomReservationReviewedList();
    this.getRoomClassifyInfo();
  },
  mounted() {
    this.$notify({
      title: "提示",
      type: "warning",
      dangerouslyUseHTMLString: true,
      message:
        '<span style="color: red;">超过预约结束时间的申请管理员只能进行删除操作，不能进行通过或者拒绝操作。</span>',
      duration: 8000,
    });
  },
  methods: {
    getRoomReservationReviewedList() {
      this.tabLoading(this.query.state, true);
      roomApi
        .userRoomReservationReviewed(this.query)
        .then((data) => {
          this.assignmentRightRoomList(data.pageData, this.query.state);
          this.cacheRoomList = data.pageData;
          this.total = data.totalSize;
          this.tabLoading(this.query.state, false);
          // console.log(this.roomList);
        })
        .catch((e) => {
          this.tabLoading(this.query.state, false);
        });
    },
    getRoomClassifyInfo() {
      dataStatistics.getRoomClassifyInfo().then((data) => {
        this.category = data.categories;
        this.school = data.schools;
        this.teachBuilding = data.teachBuildings;
      });
    },
    handleRoomReservationPassClick(item, index) {
      this.$confirm("确定要通过该房间预约吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tabLoading(this.query.state, true);
          roomApi
            .passOrRejectRoomReserve(item.id, true)
            .then(() => {
              this.getRoomReservationReviewedList();
              this.handleDayChange();
              this.$message.success("审核成功结果已用邮件方式通知申请人");
            })
            .catch(() => {
              this.tabLoading(this.query.state, false);
            });
        })
        .catch(() => {});
    },
    handleRoomUpdateRejectClick(item, index) {
      this.rejectDialog = true;
      this.currentRejectItem = Object.assign({}, item);
    },
    confirmReject() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.rejectBtnLoading = true;
          roomApi
            .passOrRejectRoomReserve(
              this.currentRejectItem.id,
              false,
              this.form.rejectReason
            )
            .then(() => {
              this.getRoomReservationReviewedList();
              this.handleDayChange();
              this.form.rejectReason = "";
              this.$refs.form.resetFields();
              this.rejectBtnLoading = false;
              this.rejectDialog = false;
              this.$message.success("审核驳回结果已用邮件方式通知申请人");
            })
            .catch(() => {
              this.tabLoading(this.query.state, false);
            });
        } else {
          this.$message.error("请填写驳回原因后点击确定");
          return false;
        }
      });
    },
    handleRoomRecordDel(id, index) {
      this.$confirm(
        "确定要永久删除该房间预约记录吗?这会导致对应的预约人查看不到自己的该条预约记录。",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.tabLoading(this.query.state, true);
          roomApi
            .delRoomReservationRecord(id)
            .then(() => {
              // 刷新
              this.getRoomReservationReviewedList();
              this.handleDayChange();
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.tabLoading(this.query.state, false);
            });
        })
        .catch((e) => {});
    },
    refreshData() {
      this.query.page = 1;
      this.reviewDate = [];
      this.reviewedDate = [];
      this.overtime = false;
      this.getRoomReservationReviewedList();
    },
    handleTabClick(tab, event) {
      this.query.state = tab.name;
      if (tab.name != 2) {
        this.overtime = false;
      }
      this.reviewDate = [];
      this.reviewedDate = [];
      this.currentTime = new Date().getTime();
      this.getRoomReservationReviewedList();
    },
    handleDayChange(value) {
      let date = null;
      if (this.query.state == 0) {
        date = this.reviewDate;
      } else if (this.query.state == 2) {
        date = this.reviewedDate;
      }
      if (date && date.length > 1) {
        date.splice(0, 1);
      }

      //都没选择，进行刷新
      if (!date | !date.length && !this.overtime) {
        return this.getRoomReservationReviewedList();
      }

      //时间筛选
      let dayRoomList = null;
      if (date && date.length == 1) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        now.setDate(now.getDate() + (date[0] - 1));
        const todayTimestamp = now.getTime();
        now.setDate(now.getDate() + 1);
        const yesterdayTimestamp = now.getTime();
        dayRoomList = this.cacheRoomList.filter((room) => {
          const reserveStartTime = new Date(room.reserveStartTime).getTime();
          return (
            reserveStartTime >= todayTimestamp &&
            reserveStartTime <= yesterdayTimestamp
          );
        });
      }

      //时间筛选为空，不需要超时筛选
      if (dayRoomList == []) {
        return this.assignmentRightRoomList(dayRoomList, this.query.state);
      }

      //dayRoomList为null时没有进行时间筛选，
      const overtimeRoomList = this.overtime
        ? (dayRoomList || this.cacheRoomList).filter(
            (room) =>
              new Date(room.reserveEndTime).getTime() >= this.currentTime
          )
        : dayRoomList || this.cacheRoomList;
      console.log(overtimeRoomList);
      this.assignmentRightRoomList(
        overtimeRoomList.reverse(),
        this.query.state
      );
    },
    tabLoading(state, start) {
      let that = this;
      switch (state) {
        case "0":
          that.tabReviewLoading = !!start;
          break;
        case "2":
          that.tabReviewedLoading = !!start;
          break;
        case "3":
          that.tabCancelLoading = !!start;
          break;
        case "4":
          that.tabRejectLoading = !!start;
          break;
        case "6":
          that.tabTimeoutLoading = !!start;
          break;
      }
    },
    assignmentRightRoomList(roomList, state) {
      let that = this;
      switch (state) {
        case "0":
          that.roomReviewList = roomList;
          break;
        case "2":
          that.roomReviewedList = roomList;
          break;
        case "3":
          that.roomCancelList = roomList;
          break;
        case "4":
          that.roomRejectList = roomList;
          break;
        case "6":
          that.roomTimeoutList = roomList;
          break;
      }
    },
  },
};
</script>

<style scoped></style>
