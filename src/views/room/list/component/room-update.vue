<template>
  <div style="margin: 10px;">
    <el-form :model="currentRoom" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="校区" prop="school">
        <el-select style="width: 100%;" v-model="currentRoom.school" placeholder="请选择校区(例如:花江校区)">
          <el-option :key="index" v-for="(item, index) in schools" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼栋" prop="teachBuilding">
        <el-input placeholder="请输入楼栋" type="number" v-model="currentRoom.teachBuilding"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select style="width: 100%;" v-model="room.category" placeholder="请选择类别(例如:活动室、休息室等等)">
          <el-option :key="index" v-for="(item, index) in categories" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="容量" prop="capacity">
        <el-input placeholder="请输入容量" v-model="currentRoom.capacity"></el-input>
      </el-form-item>
      <el-form-item label="房间名称" prop="roomName">
        <el-input placeholder="请输入房间名称" v-model="currentRoom.roomName"></el-input>
      </el-form-item>
      <el-form-item label="设备信息" prop="equipmentInfo">
        <el-input placeholder="请输入设备信息" :rows="4" type="textarea" v-model="currentRoom.equipmentInfo"></el-input>
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
import configApi from "@/api/config";
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
    return {
      schools: [],
      categories: [],
      currentRoom: this.room,
      btnLoading: false,
      rules: {
        school: [
          {required: true, message: '请选择校区', trigger: 'change'}
        ],
        teachBuilding: [
          {required: true, message: '请填写校区', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        category: [
          {required: true, message: '请选择类别', trigger: 'change'}
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
  created() {
    this.getConfigInfo()
  },
  methods: {
    getConfigInfo() {
      configApi.querySysConfigByKeyApi("schools").then(data => {
        this.schools = JSON.parse(data.configValue).schools
      })
      configApi.querySysConfigByKeyApi("categories").then(data => {
        this.categories = JSON.parse(data.configValue).categories
      })
    },
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
