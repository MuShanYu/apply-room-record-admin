<template>
  <div>
    <el-form :model="role" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="角色标识" prop="roleName">
        <el-input v-model="role.roleName" style="width: 70%;"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleDes">
        <el-input v-model="role.roleDes" style="width: 70%;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'addUpdateRole',
    props: {
      role:{
        type: Object,
        default() {
          return {
            roleName: '',
            roleDes: ''
          }
        }
      }
    },
    data() {
      return {
        rules: {
          roleName: [
            { required: true, message: '请输入角色标识', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
          roleDes: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      handleCancel() {
        this.$emit('clickCancel')
      },
      handleSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$emit('clickSubmit', this.role)
          } else {
            return false
          }
        })

      }
    }
  }
</script>

<style scoped lang="scss">

</style>
