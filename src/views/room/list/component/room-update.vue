<template>
  <div style="margin: 10px;">
    <el-form :model="currentRoom" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="校区" prop="school">
        <el-input v-model="currentRoom.school"></el-input>
      </el-form-item>
      <el-form-item label="楼栋" prop="teachBuilding">
        <el-input type="number" v-model="currentRoom.teachBuilding"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-input v-model="currentRoom.category"></el-input>
      </el-form-item>
      <el-form-item label="容量" prop="capacity">
        <el-input v-model="currentRoom.capacity"></el-input>
      </el-form-item>
      <el-form-item label="房间名称" prop="roomName">
        <el-input v-model="currentRoom.roomName"></el-input>
      </el-form-item>
      <el-form-item label="设备信息" prop="equipmentInfo">
        <el-input :rows="4" type="textarea" v-model="currentRoom.equipmentInfo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="btnLoading" @click="submitForm" type="primary">修改</el-button>
        <el-button @click="cancelUpdate" style="margin-left: 10px;">取消</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 10px;">
      <span style="font-size: 13px;color: #909399;margin-left: 10px;">(修改相应筛选条件后请刷新界面使用新的筛选条件)</span>
    </div>
  </div>
</template>

<script>
import roomApi from '@/api/room'
export default {
  name: "room-update",
  props: {
    room: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch:{
    room(val, oldVal) {
      this.$nextTick(() => {
        this.currentRoom = val
        this.$refs.ruleForm.resetFields();
      })
    }
  },
  data() {
    const validateTeachBuilding = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写校区'))
      } else if (parseInt(value) === Number(0) || parseInt(value) > Number(100)) {
        callback(new Error('楼栋范围有误 1 到 100 之间'))
      } else {
        callback()
      }
    }
    return {
      currentRoom: this.room,
      btnLoading: false,
      rules: {
        school: [
          {required: true, message: '请填写校区', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        teachBuilding: [
          {required: true, trigger: 'blur', validator: validateTeachBuilding}
        ],
        category: [
          {required: true, message: '请填写类别', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        capacity: [
          {required: true, message: '请填写容量', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        roomName: [
          {required: true, message: '请填写房间名称(房间名称+房间号)', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        equipmentInfo: [
          {required: true, message: '请填写设备信息', trigger: 'blur'},
          {min: 1, max: 512, message: '长度在 1 到 512 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          roomApi.updateRoom(this.currentRoom).then(() => {
            this.btnLoading = false
            this.$message.success("修改成功")
            // 发送修改成功的对象
            this.$emit("updateSuccess", this.currentRoom)
          }).catch(e => {
            this.btnLoading = false
          })
        } else {
          this.$message.warning("请检查您输入的信息")
          return false;
        }
      });
    },
    cancelUpdate() {
      this.$emit('cancelUpdate')
    }
  }
}
</script>

<style scoped>

</style>
