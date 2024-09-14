<template>
  <div>
    <el-form :model="message" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="消息内容" prop="content">
        <el-input v-model="message.content"
                  type="textarea"
                  clearable
                  show-word-limit
                  autosize
                  maxlength="128"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-select v-model="message.messageType" placeholder="请选择消息类型">
          <el-option label="待办通知" :value="0"></el-option>
          <el-option label="结果通知" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送方式" prop="type">
        <el-checkbox-group v-model="message.type">
          <el-checkbox label="站内消息" name="0"></el-checkbox>
          <el-checkbox label="邮件消息" name="1"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button style="margin-right: 15px;" @click="$emit('cancelClick')">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {sendMessageApi} from "@/api/message";

const sendTypeMap = {
  "站内消息": 0,
  "邮件消息": 1
}
export default {
  name: "SendMessage",
  props: {
    userId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      message: {
        content: '',
        messageType: 0,
        type: [],
        sendType: [],
        messageReceiverId: ''
      },
      rules: {
        content: [
          {required: true, message: '消息内容不能为空', trigger: 'blur'}
        ],
        messageType: [
          { required: true, message: '请选择消息类型', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个消息发送方式', trigger: 'change' }
        ],
      },
      loading: false
    }
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.message.messageReceiverId = this.userId
          this.message.type.forEach(item => {this.message.sendType.push(sendTypeMap[item])})
          sendMessageApi(this.message).then(res => {
            this.loading = false
            this.$refs.ruleForm.resetFields()
            this.message.sendType = []
            this.$emit('sendMsgSuccess')
          }).catch(e => {
            this.loading = false
            this.$refs.ruleForm.resetFields()
            this.message.sendType = []
            this.$message.error('发送失败')
            this.$emit("sendMsgFailure")
          })
        } else {
          return false;
        }
      });
    }
  }
}

</script>

<style scoped lang="scss">

</style>
