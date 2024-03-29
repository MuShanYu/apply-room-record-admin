<template>
  <div class="app-container">
    <div
      :style="fixedHeader ? 'margin-top: 35px;' : ''"
      class="filter-container"
      style="display: flex"
    >
      <el-input
        v-model="query.title"
        clearable
        @clear="getNoticeList"
        placeholder="请输入检索的标题"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="getNoticeList"
      />
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="getNoticeList"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        v-permission="['super-admin']"
        @click="addNoticeDialog = true"
        v-waves
        type="primary"
        icon="el-icon-plus"
      >
        添加
      </el-button>
    </div>
    <div>
      <el-table
        :key="'1'"
        v-loading="listLoading"
        :data="noticeList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="标题" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="{ row }">
            <span class="config-value-text">{{ row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.state === 1 ? 'primary' : 'danger'">
              {{ row.state === 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布人" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.publishUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="180" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.updateTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作" align="center">
          <template slot-scope="{ row, $index }">
            <el-button
              v-permission="['super-admin']"
              :disabled="row.state !== 1"
              @click="handleUpdateNoticeClick(row, $index)"
              v-waves
              style="margin: 3px"
              type="primary"
              size="mini"
            >
              修改
            </el-button>
            <el-button
              type="danger"
              v-waves
              plain
              @click="handleDelClick(row, $index)"
              v-permission="['super-admin']"
              style="margin: 3px"
              size="mini"
            >
              {{ row.state === 1 ? "撤销" : "取消撤销" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.size"
        @pagination="getNoticeList"
      />
    </div>
    <el-dialog :center="true" title="添加公告" :visible.sync="addNoticeDialog">
      <notice-add
        @cancelUpdate="addNoticeDialog = false"
        @addSuccess="addNoticeSuccessHandler"
      />
    </el-dialog>

    <el-dialog :center="true" title="修改公告" :visible.sync="updateNoticeDialog">
      <notice-update
        @cancelUpdate="updateNoticeDialog = false"
        @updateSuccess="updateNoticeSuccessHandler"
        :notice="currentNotice"
      />
    </el-dialog>
  </div>
</template>

<script>
import noticeApi from "@/api/notice";
import NoticeAdd from "@/views/notice/component/notice-add";
import NoticeUpdate from "@/views/notice/component/notice-update";
import Pagination from "@/components/Pagination";
import { mapState } from "vuex";

export default {
  name: "NoticeManager",
  components: {
    Pagination,
    NoticeAdd,
    NoticeUpdate
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
  },
  data() {
    return {
      query: {
        page: 1,
        size: 10,
        title: "",
      },
      listLoading: false,
      addNoticeDialog: false,
      updateNoticeDialog:false,
      currentNotice: {},
      noticeList: [],
      total: 0,
    };
  },
  created() {
    this.getNoticeList();
  },
  methods: {
    getNoticeList() {
      this.listLoading = true;
      noticeApi
        .noticeList(this.query)
        .then((data) => {
          this.noticeList = data.pageData;
          this.total = data.totalSize;
          this.listLoading = false;
          console.log(this.noticeList);
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    addNoticeSuccessHandler(notice) {
      this.getNoticeList();
      this.addNoticeDialog = false;
    },
    updateNoticeSuccessHandler(notice){
      let noticeIndex = this.noticeList.findIndex(item => item.id === notice.id)
      this.noticeList.splice(noticeIndex, 1, notice);
      this.updateNoticeDialog = false
    },
    handleUpdateNoticeClick(item, index) {
      this.currentNotice = Object.assign({}, item)
      this.updateNoticeDialog = true
    },
    handleDelClick(row, index) {
      let text =
        row.state === 1 ? "确认要撤销该公告吗?" : "确认要取消撤销该公告吗?";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (row.state === 1) {
            noticeApi.delNotice(row.id).then((res) => {
              row.state = -1;
              this.$message.success("撤销成功");
            });
          } else {
            noticeApi.resetNotice(row.id).then((res) => {
              row.state = 1;
              this.$message.success("取消撤销成功");
            });
          }
        })
        .catch((e) => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
