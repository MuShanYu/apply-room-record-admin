<template>
  <div style="padding: 15px;">
    <el-row :gutter="15">
      <el-col :span="4">
        <el-select v-model="queryParams.businessType" placeholder="请选择业务类型"
                   style="width: 100%;" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input
          placeholder="请输入操作人姓名"
          v-model="queryParams.name"
          clearable>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-date-picker
          v-model="time"
          type="daterange"
          value-format="timestamp"
          @change="handleDateChange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button @click="handleSearch" style="margin-left: 10px;" icon="el-icon-search" type="primary">搜索
        </el-button>
<!--        <el-button @click="handleBatchDel" style="margin-left: 10px;" icon="el-icon-delete" type="danger">批量删除-->
<!--        </el-button>-->
        <el-button @click="handleReset" icon="el-icon-refresh-right">重置条件</el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 15px;">
      <el-table
        ref="dataTable"
        v-loading="listLoading"
        :data="dataList"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="width: 100%;">
        <el-table-column
          align="center"
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column label="模块名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作类型" align="center">
          <template slot-scope="{row}">
            <span>{{ row.businessType | businessTypeNameFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" align="center">
          <template slot-scope="{row}">
            <span>{{ row.operatorName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作地址" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.state === 1 ? 'success' : 'danger'">
              {{ row.state === 1 ? "成功" : "失败" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="消耗时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.costTime }}毫秒</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button @click="handleDetail($index)" icon="el-icon-view" size="medium" type="text">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.size"
                  @pagination="getDataList"/>
    </div>

    <el-dialog :visible.sync="detailDialogVisible" width="55%">
      <template slot="title">
        <div style="text-align: center;font-size: 18px;">日志详情</div>
      </template>
      <div>
        <el-descriptions class="margin-top" :column="3" :border="true">
          <el-descriptions-item label="模块名称">{{ curItem.title }}</el-descriptions-item>
          <el-descriptions-item label="操作来源"> {{ curItem.operateSource }}</el-descriptions-item>
          <el-descriptions-item label="请求方式">{{ curItem.requestMethod }}</el-descriptions-item>
          <el-descriptions-item label="请求ip">{{ curItem.ip }}</el-descriptions-item>
          <el-descriptions-item label="请求地址"> {{ curItem.url }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" :column="1" :border="true">
          <el-descriptions-item label="操作方法">{{ curItem.method }}</el-descriptions-item>
          <el-descriptions-item label="请求参数">{{ curItem.param }}</el-descriptions-item>
          <el-descriptions-item label="返回参数">{{ curItem.result }}</el-descriptions-item>
          <el-descriptions-item v-if="curItem.errorMsg !== '' && curItem.state === 0" label="错误信息">
            {{ curItem.errorMsg }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" :column="3" :border="true" :contentStyle="{textAlign: 'center'}">
          <el-descriptions-item label="操作状态">
            <el-tag :type="curItem.state === 1 ? 'success' : 'danger'">
              {{ curItem.state === 1 ? "成功" : "失败" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="消耗时间">{{ curItem.costTime }}毫秒</el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ curItem.createTime | parseTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

    </el-dialog>

  </div>
</template>

<script>

const businessType = [{
  value: 1,
  label: '新增'
}, {
  value: 2,
  label: '修改'
}, {
  value: 3,
  label: '删除'
}, {
  value: 4,
  label: '授权'
}, {
  value: 5,
  label: '导出'
}, {
  value: 6,
  label: '导入'
}, {
  value: 0,
  label: '其他'
}]
import {getSysOperateListApi, delLogApi} from "@/api/sys-operate-log";

import Pagination from "@/components/Pagination";

export default {
  name: 'SysOperateLog',
  components: {
    Pagination
  },
  data() {
    return {
      options: businessType,
      time: [],
      queryParams: {
        page: 1,
        size: 20,
        businessType: null,
        name: null,
        startTime: null,
        endTime: null
      },
      dataList: [],
      listLoading: false,
      total: 0,
      detailDialogVisible: false,
      curItem: {},
      multipleSelection: []
    }
  },
  filters: {
    businessTypeNameFilter(type) {
      if (type === 0) {
        return "其他"
      }
      return businessType[type - 1].label
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.listLoading = true
      getSysOperateListApi(this.queryParams).then(res => {
        this.total = res.totalSize;
        this.dataList = res.pageData
        this.listLoading = false
      }).catch(e => this.listLoading = false)
    },
    handleDateChange(time) {
      if (time) {
        this.queryParams.startTime = time[0];
        this.queryParams.endTime = time[1];
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    },
    handleSearch() {
      if (!this.queryParams.businessType) {
        this.queryParams.businessType = null;
      }
      if (!this.queryParams.name) {
        this.queryParams.name = null;
      }
      this.getDataList()
    },
    handleReset() {
      this.queryParams.businessType = null;
      this.queryParams.name = null;
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
      this.time = []
      this.getDataList()
    },
    handleDetail(index) {
      this.curItem = Object.assign({}, this.dataList[index])
      this.detailDialogVisible = true
    },
    handleBatchDel() {
      if (this.multipleSelection.length !== 0) {
        this.$confirm('确定要删除已经选择的日志记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.multipleSelection.map(item => item.id)
          delLogApi(ids).then(res => {
            this.$message.success("删除成功")
            this.$refs.dataTable.clearSelection();
            this.getDataList()
          })
        }).catch((e) => {

        })
      } else {
        this.$message.warning("未勾选要删除的日志")
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}
</script>

<style scoped lang="scss">

</style>
