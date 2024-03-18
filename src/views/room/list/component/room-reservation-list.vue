<template>
  <div style="margin: 10px">
    <div style="margin-bottom: 10px">
      <span class="tip">预约起始时间：</span>
      <el-date-picker
        ref="datePick"
        :clearable="false"
        @change="handleTimeChange"
        v-model="selectedTime"
        value-format="timestamp"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="起始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </div>
    <div>
      <el-table
        :key="'1'"
        v-loading="listLoading"
        :data="dataList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="预约人" align="center" width="100">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="预约起始时间"
          prop="reserveStartTime"
          sortable
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.reserveStartTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="星期" align="center" width="60">
          <template slot-scope="{ row }">
            <span>{{ weekDay(row.reserveStartTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约结束时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.reserveEndTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约理由" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.roomUsage }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{
              row.verifyUserName === null ? "暂无" : row.verifyUserName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.state | statusFilter">
              {{ row.state | msgFilter }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.size"
        @pagination="getRoomReservationList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import roomApi from "@/api/room";
const statusMap = {
  notReviewed: {
    status: "primary",
    msg: "待审批",
  },
  ban: {
    status: "danger",
    msg: "驳回",
  },
  reviewed: {
    status: "success",
    msg: "已审批",
  },
  userCanceled: {
    status: "info",
    msg: "用户取消",
  },
  timeOut: {
    status: "warning",
    msg: "超时未处理",
  },
};
const datelist = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
export default {
  name: "RoomReservationList",
  filters: {
    statusFilter(status) {
      switch (status) {
        case 0:
          return statusMap.notReviewed.status;
        case 1:
          return statusMap.reviewed.status;
        case 2:
          return statusMap.userCanceled.status;
        case 3:
          return statusMap.ban.status;
        case 4:
          return statusMap.timeOut.status;
      }
    },
    msgFilter(status) {
      switch (status) {
        case 0:
          return statusMap.notReviewed.msg;
        case 1:
          return statusMap.reviewed.msg;
        case 2:
          return statusMap.userCanceled.msg;
        case 3:
          return statusMap.ban.msg;
        case 4:
          return statusMap.timeOut.msg;
      }
    },
  },
  props: {
    roomId: {
      type: String,
      default: "",
    },
  },
  components: {
    Pagination,
  },
  watch: {
    roomId(val, oldVal) {
      this.selectedTime = [
        new Date().getTime(),
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      ];
      this.handleTimeChange([
        new Date().getTime(),
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      ]);
    },
  },
  data() {
    return {
      listLoading: false,
      query: {
        page: 1,
        size: 10,
        startTime: new Date().getTime(),
        endTime: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
        roomId: "",
      },
      dataList: [],
      total: 0,
      selectedTime: [
        new Date().getTime(),
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const time = new Date();
              picker.$emit("pick", [time.getTime(), time.getTime()]);
            },
          },
          {
            text: "明天",
            onClick(picker) {
              const time = new Date();
              time.setTime(time.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", [time.getTime(), time.getTime()]);
            },
          },
          {
            text: "后一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start.getTime(), end.getTime()]);
            },
          },
          {
            text: "前一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start.getTime(), end.getTime()]);
            },
          },
          {
            text: "前半个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
              picker.$emit("pick", [start.getTime(), end.getTime()]);
            },
          },
          {
            text: "前一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start.getTime(), end.getTime()]);
            },
          },
        ],
      },
    };
  },
  created() {
    this.getRoomReservationList();
  },
  methods: {
    getRoomReservationList() {
      this.listLoading = true;
      this.query.roomId = this.roomId;
      roomApi
        .roomReservationDetail(this.query)
        .then((data) => {
          this.dataList = data.pageData;
          this.total = data.totalSize;
          // console.log(this.dataList);
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    handleTimeChange(val) {
      this.query.startTime = val[0];
      this.query.endTime = val[1];
      this.query.page = 1;
      this.getRoomReservationList();
    },
    weekDay(time) {
      return datelist[new Date(time).getDay()];
    },
  },
};
</script>

<style scoped></style>
