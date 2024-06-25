<template>
  <div>
    <el-form :model="user" :rules="rules" ref="ruleForm" label-width="50px">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="学院" prop="institute">
            <el-input v-model="user.institute"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" prop="stuNum">
            <el-input v-model="user.stuNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="user.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="user.mail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top: 15px;text-align: right;">
      <el-button @click="handleSubmit" type="primary">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UpdateInfo',
    props: {
      user: {
        type: Object,
        default() {
          return {

          }
        }
      }
    },
    components: {

    },
    data() {
      return{
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          institute: [
            { required: true, message: '请输入学院', trigger: 'blur' }
          ],
          mail: [
            { required: true, message: '请输入邮箱', trigger: 'blur' }
          ],
          stuNum: [
            { required: true, message: '请输入学号/工号', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$emit('submitClick', this.user)
          } else {
            return false
          }
        })
      },
      handleCancel() {
        this.$emit('cancelClick')
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
