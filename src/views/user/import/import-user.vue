<template>
  <div class="" style="margin: 15px;">
    <el-result v-if="showResult" :icon="type" :title="resTitle" :subTitle="subTitle">
      <template slot="extra">
        <el-button @click="handleReUpload" type="primary">重新上传</el-button>
      </template>
    </el-result>
    <div v-if="showResult && errorMsg.length > 0"
         style="margin-top: 15px;margin-bottom: 15px;background-color: rgb(240, 242, 245);padding: 15px;display: flex;">
      <div v-for="item in errorMsg" style="font-size: 12px;color: #909399;margin: 10px;width: 100%;">
        {{item}}
      </div>
    </div>
    <div v-if="errorData.length > 0 && showResult">
      <div style="text-align: center;font-size: 18px;color: #000000;">错误数据如下</div>
      <el-table :data="errorData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column
          prop="stuNum"
          label="工号/学号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="institute"
          label="学院">
        </el-table-column>
      </el-table>
    </div>
    <div v-if="showConfirm" style="text-align: right;margin-bottom: 15px;">
      <el-button @click="handleUpload" :loading="loading" type="primary">确认上传</el-button>
    </div>
    <div v-if="isNotUpload">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>
      </el-table>
    </div>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import userApi from '@/api/user'

import constants from "@/common/CommonCantans";

export default {
  name: 'UploadExcel',
  components: {UploadExcelComponent},
  computed: {
    constants() {
      return constants;
    }
  },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      errorData: [],
      errorMsg: [],
      showConfirm: false,
      isNotUpload: true,
      subTitle: '',
      type: 'success',
      resTitle: '',
      showResult: false,
      isReUpload: false,
      loading: false
    }
  },
  methods: {
    resetData() {
      this.tableData = []
      this.tableHeader = []
      this.showConfirm = false
      this.errorData = []
      this.isNotUpload = true
      this.showResult = false
      this.isReUpload = false
      this.loading = false
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 3

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '文件的大小不要超过3MB',
        type: 'warning'
      })
      return false
    },
    handleSuccess({results, header}) {
      this.$message.success('数据解析成功，请查看，确认后一键上传')
      this.tableData = results
      this.tableHeader = header
      this.showConfirm = true
    },
    handleUpload() {
      if (!('工号/学号' in this.tableData[0])) {
        this.$message.error("请上传正确格式的数据，请参看模板上传")
        return
      }
      this.loading = true
      let users = []
      this.tableData.forEach(v => {
        let user = {
          stuNum: v['工号/学号'],
          name: v['姓名'],
          institute: v['学院'],
          tel: v['联系方式']
        }
        users.push(user)
      })
      userApi.batchInsertUser(users).then(data => {
        this.errorData = data.errorData
        this.errorMsg = data.errorMsg
        if (this.errorData.length === 0) {
          this.type = 'success'
          this.resTitle = '上传成功'
        } else {
          this.type = 'error'
          this.resTitle = '上传失败'
        }
        this.subTitle = "已成功上传数据：" + (this.tableData.length - this.errorData.length) + "条，上传失败数据：" + this.errorData.length + "条";
        this.showResult = true
        this.isNotUpload = false
        this.showConfirm = false
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    handleReUpload() {
      this.resetData()
    }
  }
}
</script>
