<template>
  <div class="" style="margin: 15px;">
    <div v-if="showProgress" style="margin-bottom: 15px;">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="uploadPercentage" status="success"></el-progress>
    </div>
    <el-result v-if="showResult" :icon="type" :title="resTitle" :subTitle="subTitle">
      <template slot="extra">
        <el-button @click="handleReUpload" type="primary">重新上传</el-button>
      </template>
    </el-result>
    <div v-if="showResult && errorMsg.length > 0"
         style="margin-top: 15px;margin-bottom: 15px;background-color: rgb(240, 242, 245);padding: 15px;display: flex;">
      <div v-for="item in errorMsg" style="font-size: 12px;color: #909399;margin: 10px;width: 100%;">
        {{ item }}
      </div>
    </div>
    <div v-if="errorData.length > 0 && showResult">
      <div style="text-align: center;font-size: 18px;color: #000000;">错误数据如下</div>
      <el-table :data="errorData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column label="校区" width="150" align="center">
          <template slot-scope="{row}">
            <span>{{ row.school }}</span>
          </template>
        </el-table-column>
        <el-table-column label="楼栋" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.teachBuilding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间类别" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="容量" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.capacity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间名称" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roomName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备信息" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.equipmentInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人姓名" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.chargePerson }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人联系方式" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.chargePersonTel }}</span>
          </template>
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
import roomApi from "@/api/room";

export default {
  name: 'UploadExcel',
  components: {UploadExcelComponent},
  watch: {
    uploadCount(val, oldVal) {
      if (val > 0) {
        this.showProgress = true
      }
      if (val > 0 && val === this.tableData.length) {
        if (this.successUploadCount === this.tableData.length) {
          this.type = 'success'
          this.resTitle = '上传成功'
        } else {
          this.type = 'error'
          this.resTitle = '上传失败'
          this.tableData = this.errorData
        }
        this.subTitle = "已成功上传数据：" + this.successUploadCount + "条，上传失败数据：" + this.errorData.length + "条";
        this.showResult = true
        this.isNotUpload = false
        this.showConfirm = false
      }
    }
  },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      showConfirm: false,
      showProgress: false,
      uploadPercentage: 0,
      successUploadCount: 0,
      uploadCount: 0,
      errorData: [],
      errorMsg: [],
      title: '上传进度',
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
      this.showProgress = false
      this.uploadPercentage = 0
      this.successUploadCount = 0
      this.uploadCount = 0
      this.errorData = []
      this.errorMsg = []
      this.isNotUpload = true
      this.showResult = false
      this.isReUpload = false
      this.showProgress = false
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
      // console.log(this.tableData);
      this.showConfirm = true
    },
    async handleUpload() {
      if (!('校区' in this.tableData[0])) {
        this.$message.error("请上传正确格式的数据，请参看模板上传")
        return
      }
      this.loading = true
      for (const v of this.tableData) {
        let room = {
          school: v['校区'],
          teachBuilding: v['楼栋'],
          category: v['类别'],
          roomName: v['房间名称'],
          equipmentInfo: v['设备信息'],
          capacity: v['容量'],
          chargePerson: v['负责人姓名'],
          chargePersonTel: v['负责人联系方式']
        }
        await this.insertRoom(room)
      }
    },
    insertRoom(room) {
      return new Promise((resolve, reject) => {
        roomApi.insertRoomAndRegisterAdminUser(room).then(data => {
          this.successUploadCount++
          this.uploadCount++;
          this.uploadPercentage = Math.ceil((this.successUploadCount / this.tableData.length) * 100)
          resolve()
        }).catch(e => {
          this.errorData.push(room)
          if (!this.errorMsg.some(s => s === e)) {
            this.errorMsg.push(e)
          }
          this.uploadCount++
          resolve()
        })
      })
    },
    handleReUpload() {
      this.resetData()
    }
  }
}
</script>
