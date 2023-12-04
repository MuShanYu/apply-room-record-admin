<template>
  <div v-loading="loading" style="padding: 25px;background-color: rgb(246,248,249);height: 100vh;">
    <el-row v-if="userInfo" :gutter="20">
      <el-col :span="10">
        <el-card class="user-card" shadow="hover">
          <div style="padding-left: 20px;padding-right: 20px;" class="user-card-body">
            <!--头像-->
            <div style="text-align: center;">
              <el-avatar :size="100" :src="config.avatar"/>
            </div>
            <div style="font-size: 20px;font-weight: bold;padding-top: 15px;padding-bottom: 15px;text-align: center;">
              <span>{{ userInfo.name }}</span>
            </div>
            <div class="user-info">
              <div>
                <span><i style="margin-right: 5px;" class="el-icon-user"></i>学号/工号：{{ userInfo.stuNum }}</span>
              </div>
              <div style="padding-top: 15px;padding-bottom: 15px;">
                <span><i style="margin-right: 5px;" class="el-icon-school"></i>学院：{{ userInfo.institute }}</span>
              </div>
              <div>
                <span><i style="margin-right: 5px;" class="el-icon-message"></i>邮箱：{{
                    userInfo.mail === null ? '未填写邮箱' : userInfo.mail
                  }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card shadow="hover">
          <div>
            <el-tabs v-model="activeName">
              <el-tab-pane label="基本信息" name="info">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="学号/工号" prop="stuNum">
                    <el-input v-model="ruleForm.stuNum"></el-input>
                  </el-form-item>
                  <el-form-item label="学院" prop="institute">
                    <el-select style="width: 100%;" v-model="ruleForm.institute" placeholder="请选择所在学院">
                      <el-option :key="index" v-for="(item, index) in institutes" :label="item"
                                 :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="mail">
                    <el-input v-model="ruleForm.mail"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button :loading="btnLoading" type="primary" @click="handleUpdateInfo">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div style="text-align: center;color: #909399;font-size: 12px;">
            <span>
              注意：个人信息每24小时只允许修改1次！(*代表必填信息)
            </span>
          </div>
          <div style="text-align: center;color: #909399;font-size: 12px;margin-top: 10px;">
            <span>
              修改信息后H5端请重新登录同步个人信息！

            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import config from "@/common/sys-config";
import {mapGetters} from "vuex";

import configApi from '@/api/config'
import userApi from '@/api/user'

export default {
  name: "UserProfile",
  data() {
    const validateMail = (rule, value, callback) => {
      // 用户填写了邮箱
      if (value !== null && value.length > 0) {
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
          callback(new Error('请输入正确格式的邮箱'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      activeName: 'info',
      ruleForm: {
        id: '',
        name: '',
        stuNum: '',
        institute: '',
        mail: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入您的姓名', trigger: 'blur'},
          {min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur'}
        ],
        stuNum: [
          {required: true, message: '请输入您的学号/工号', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        mail: [{required: false, trigger: 'blur', validator: validateMail}],
        institute: [
          {required: true, message: '请选择学院', trigger: 'change'}
        ]
      },
      loading: false,
      institutes: [],
      btnLoading: false
    }
  },
  computed: {
    config() {
      return config
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.loading = true
    configApi.querySysConfigByKeyApi('institutes').then(res => {
      this.institutes = JSON.parse(res.configValue).institutes
      this.ruleForm.name = this.userInfo.name
      this.ruleForm.stuNum = this.userInfo.stuNum
      this.ruleForm.institute = this.userInfo.institute
      this.ruleForm.mail = this.userInfo.mail
      this.ruleForm.id = this.userInfo.id
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  },
  methods: {
    handleUpdateInfo() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          userApi.updateUserInfo(this.ruleForm).then(res => {
            // 更新store里面的数据
            let newUserInfo = Object.assign({}, this.userInfo)
            newUserInfo.name = this.ruleForm.name
            newUserInfo.stuNum = this.ruleForm.stuNum
            newUserInfo.institute = this.ruleForm.institute
            newUserInfo.mail = this.ruleForm.mail
            this.$store.dispatch('user/updateUserInfo', newUserInfo).then(() => {
              this.$message.success('信息修改成功')
              this.btnLoading = false
            })
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.user-info {
  color: #909399;
  font-size: 14px;
}
</style>
