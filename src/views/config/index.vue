<template>
  <div class="app-container">
    <div :style="fixedHeader ? 'margin-top: 35px;' : ''" class="filter-container"
         style="text-align: left;margin-bottom: 10px;">
      <el-button id="config-list-add" v-permission="['super-admin']" v-waves icon="el-icon-plus" @click="showAdd = true" type="primary">
        添加配置
      </el-button>
    </div>
    <div>
      <el-table
        :key="'1'"
        v-loading="loading"
        :data="configList"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column label="配置key" align="center">
          <template slot-scope="{row}">
            <span>{{ row.configKey }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配置value" align="center">
          <template slot-scope="{row}">
            <span class="config-value-text">{{ row.configValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配置描述" align="center">
          <template slot-scope="{row}">
            <span>{{ row.configDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state === 1 ? 'primary' : 'danger'">
              {{ row.state === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作" align="center">
          <template slot-scope="{row, $index}">
            <el-button v-permission="['super-admin']" :disabled="row.state !== 1"
                       @click="handleUpdateConfigClick(row, $index)" v-waves
                       style="margin: 3px;" type="primary" size="mini">
              修改
            </el-button>
            <el-button type="danger" v-waves plain @click="handleDelClick(row, $index)"
                       v-permission="['super-admin']" style="margin: 3px;" size="mini">
              {{ row.state === -1 ? '解除' : '禁用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                  @pagination="getConfigList"/>
    </div>
    <el-drawer
      :visible.sync="showUpdate"
      :with-header="false"
      size="60%"
      :direction="'rtl'">
      <template v-slot:default>
        <div style="display: flex;justify-content: space-between;padding: 10px;background-color: #f7f7f7">
          <el-input :disabled="true" show-word-limit maxlength="32" v-model="currentConfig.configKey" style="width: 45%;"
                    placeholder="请输入配置名称"></el-input>
          <el-input show-word-limit maxlength="64" v-model="currentConfig.configDesc"
                    style="width: 55%;margin-left: 5px;margin-right: 5px;"
                    placeholder="配置描述"></el-input>
          <el-button v-waves @click="showUpdate = false">
            取消
          </el-button>
          <el-button v-waves :loading="updateBtnLoading" @click="confirmUpdate" type="primary">
            修改
          </el-button>
        </div>
        <div class="editor-container">
          <json-editor :key="1" ref="jsonEditor" v-model="currentConfig.configValue"/>
        </div>
      </template>
    </el-drawer>
    <el-drawer
      :visible.sync="showAdd"
      :with-header="false"
      size="60%"
      :direction="'rtl'">
      <template v-slot:default>
        <div style="display: flex;justify-content: space-between;padding: 10px;background-color: #f7f7f7">
          <el-input show-word-limit maxlength="32" v-model="addDTO.key" style="width: 45%;"
                    placeholder="请输入配置名称"></el-input>
          <el-input show-word-limit maxlength="64" v-model="addDTO.configDesc"
                    style="width: 55%;margin-left: 5px;margin-right: 5px;"
                    placeholder="配置描述"></el-input>
          <el-button v-waves @click="showAdd = false">
            取消
          </el-button>
          <el-button v-waves :loading="addBtnLoading" @click="confirmAdd" type="primary">
            确认
          </el-button>
        </div>
        <div class="editor-container">
          <json-editor :key="2" ref="jsonEditorAdd" v-model="addDTO.value"/>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import Pagination from "@/components/Pagination";

import configApi from '@/api/config'
import {mapState} from "vuex";

export default {
  name: 'JsonEditorDemo',
  components: {
    JsonEditor,
    Pagination
  },
  computed: {
    ...mapState({
      fixedHeader: state => state.settings.fixedHeader
    })
  },
  data() {
    return {
      query: {
        page: 1,
        size: 10
      },
      configList: [],
      total: 0,
      addBtnLoading: false,
      updateBtnLoading: false,
      loading: true,
      showAdd: false,
      showUpdate: false,
      addDTO: {
        key: '',
        value: '',
        configDesc: ''
      },
      currentConfig: {},
      currentIndex: 0
    }
  },
  created() {
    this.getConfigList();
  },
  methods: {
    getConfigList() {
      this.loading = true
      configApi.querySysConfigListApi(this.query.page, this.query.size).then(res => {
        this.configList = res.pageData
        this.total = res.totalSize
        this.loading = false
        // console.log(this.config)
      }).catch(e => {
        this.loading = false
      })
    },
    handleUpdateConfigClick(row, index) {
      this.currentConfig = Object.assign({}, row)
      this.currentConfig.configValue = JSON.parse(this.currentConfig.configValue)
      this.currentIndex = index
      this.showUpdate = true
    },
    handleDelClick(row, index) {
      let text = row.state === 1 ? '确认要禁用该配置吗?' : '确认要解除禁用该配置吗?'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        configApi.delSysConfigApi(row.id).then(res => {
          if (row.state === 1) {
            row.state = -1
            this.$message.success('禁用成功')
          } else {
            row.state = 1
            this.$message.success('解除禁用成功')
          }
        })
      }).catch(e => {

      })
    },
    confirmAdd() {
      if (this.addDTO.key === '') {
        this.$message.error("配置的名称不能为空")
        return
      }
      if (this.addDTO.configDesc === '') {
        this.$message.error("配置的描述不能为空")
        return
      }
      if (!this.isJsonString(this.$refs.jsonEditorAdd.getValue())) {
        this.$message.error("配置的内容必须是json字符串")
        return
      }
      this.$confirm('确认要添加该配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addBtnLoading = true
        let addDTOTmp = Object.assign({}, this.addDTO)
        addDTOTmp.value = this.$refs.jsonEditorAdd.getValue().replace(/\r\n/g, '').replace(/\n/g, '').replace(/\s+/g, '')
        configApi.addConfigApi(addDTOTmp).then(res => {
          this.addBtnLoading = false
          this.configList.unshift(res)
          this.$message.success('添加成功')
        }).catch(e => {
          this.addBtnLoading = false
        })
      }).catch(() => {
        this.addBtnLoading = false
      });
    },
    confirmUpdate() {
      if (this.currentConfig.configKey === '') {
        this.$message.error("配置的名称不能为空")
        return
      }
      if (this.currentConfig.configDesc === '') {
        this.$message.error("配置的描述不能为空")
        return
      }
      if (!this.isJsonString(this.$refs.jsonEditor.getValue())) {
        this.$message.error("配置的内容必须是json字符串")
        return
      }
      this.$confirm('确定要修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateBtnLoading = true
        let updateDTO = Object.assign({}, this.currentConfig)
        updateDTO.configValue = this.$refs.jsonEditor.getValue().replace(/\r\n/g, '').replace(/\n/g, '').replace(/\s+/g, '')
        configApi.updateSysConfigApi(updateDTO).then(res => {
          this.updateBtnLoading = false
          this.configList.splice(this.currentIndex, 1, updateDTO)
          this.showUpdate = false
          this.$message.success('修改成功')
        }).catch(e => {
          this.updateBtnLoading = false
        })
      }).catch(() => {
        this.updateBtnLoading = false
      });
    },
    isJsonString(str) {
      try {
        if (typeof JSON.parse(str) == "object") {
          return true;
        }
      } catch (e) {
      }
      return false;
    }
  }
}
</script>

<style scoped lang="scss">
.config-value-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
  width: 100%;
}
</style>
