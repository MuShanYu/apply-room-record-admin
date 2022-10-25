<template>
  <div style="margin: 10px;">
    <el-form :model="room" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="校区" prop="school">
        <el-select style="width: 100%;" v-model="room.school" placeholder="请选择校区(例如:花江校区)">
          <el-option :key="index" v-for="(item, index) in schools" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼栋" prop="teachBuilding">
        <el-input placeholder="请输入楼栋(输入1代表1教，2代表2教，也可以是其他名称)" v-model="room.teachBuilding"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select style="width: 100%;" v-model="room.category" placeholder="请选择类别(例如:活动室、休息室等等)">
          <el-option :key="index" v-for="(item, index) in categories" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="容量" prop="capacity">
        <el-input placeholder="请输入容量(例如:100或者可容纳100人并附带凳子)" v-model="room.capacity"></el-input>
      </el-form-item>
      <el-form-item label="房间名称" prop="roomName">
        <el-input placeholder="请输入房间名称(例如:5501或者大礼堂等等)" v-model="room.roomName"></el-input>
      </el-form-item>
      <el-form-item label="负责人姓名" prop="chargePerson">
        <el-input placeholder="请输入该房间的负责人姓名" v-model="room.chargePerson"></el-input>
      </el-form-item>
      <el-form-item label="负责人电话" prop="chargePersonTel">
        <el-input placeholder="请输入该房间的负责人电话" v-model="room.chargePersonTel"></el-input>
      </el-form-item>
      <el-form-item label="设备信息" prop="equipmentInfo">
        <el-input placeholder="请输入设备信息(当前房间拥有的设备信息,如电脑、投影仪等)" :rows="4" type="textarea" v-model="room.equipmentInfo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="btnLoading" @click="submitForm" type="primary">添加</el-button>
        <el-button @click="cancelUpdate" style="margin-left: 10px;">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import roomApi from '@/api/room'
import configApi from '@/api/config'

export default {
  name: "room-add",
  data() {
    return {
      room: {
        school: '',
        teachBuilding: '',
        category: '',
        roomName: '',
        equipmentInfo: '',
        capacity: '',
        chargePerson: '',
        chargePersonTel: ''
      },
      btnLoading: false,
      rules: {
        school: [
          {required: true, message: '请选择校区', trigger: 'change'}
        ],
        teachBuilding: [
          {required: true, message: '请填写楼栋信息', trigger: 'blur'},
          {min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur'}
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
        chargePerson: [
          {required: true, message: '请填写负责人姓名', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        chargePersonTel: [
          {required: true, message: '请填写房间负责人联系方式', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入11位联系方式', trigger: 'blur'}
        ],
        equipmentInfo: [
          {required: true, message: '请填写设备信息', trigger: 'blur'},
          {min: 1, max: 512, message: '长度在 1 到 512 个字符', trigger: 'blur'}
        ]
      },
      schools: [],
      categories: []
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
          roomApi.addRoom(this.room).then(data => {
            this.btnLoading = false
            this.$message.success("添加成功")
            // 发送修改成功的对象
            this.$emit("addSuccess", data)
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
