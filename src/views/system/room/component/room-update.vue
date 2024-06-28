<template>
  <div style="margin: 10px;">
    <el-form :model="currentRoom" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="校区" prop="school">
        <el-select style="width: 100%;" v-model="currentRoom.school" placeholder="请选择校区(例如:花江校区)">
          <el-option :key="index" v-for="(item, index) in schools" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼栋" prop="teachBuilding">
        <el-input placeholder="请输入楼栋(输入1代表1教，2代表2教，也可以是其他名称)"
                  v-model="room.teachBuilding"></el-input>
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
      <el-form-item label="负责人" prop="chargePerson">
        <span>{{ room.chargePerson }}</span>
        <el-button v-permission="['system:room:updateCharger']" @click="updateCharger = true" style="margin-left: 15px;" type="text">修改</el-button>
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
      <span
        style="font-size: 13px;color: #909399;margin-left: 10px;">(修改相应筛选条件后请刷新界面使用新的筛选条件)</span>
    </div>

    <el-dialog
      title="修改负责人"
      :append-to-body="true"
      :modal-append-to-body="true"
      :visible.sync="updateCharger">
      <div style="margin: 10px;">
        <el-form :model="charger" :rules="chargerRules" ref="chargerRuleForm" label-width="130px">
          <el-form-item label="负责人姓名" prop="chargePerson">
            <el-input placeholder="请输入该房间的负责人姓名" v-model="charger.chargePerson"></el-input>
          </el-form-item>
          <el-form-item label="负责人学号/工号" prop="chargePersonStNum">
            <el-input placeholder="请输入该房间的负责人学号或工号" v-model="charger.chargePersonStNum"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="updateChargerLoading" @click="handleUpdateCharger" type="primary">修改</el-button>
            <el-button @click="updateCharger = false" style="margin-left: 10px;">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
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
  watch: {
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
        equipmentInfo: [
          {required: true, message: '请填写设备信息', trigger: 'blur'},
          {min: 1, max: 512, message: '长度在 1 到 512 个字符', trigger: 'blur'}
        ]
      },
      chargerRules: {
        chargePerson: [
          {required: true, message: '请填写负责人姓名', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        chargePersonStNum: [
          {required: true, message: '请填写房间负责人工号或学号', trigger: 'blur'},
          {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
        ],
      },
      updateCharger: false,
      charger: {
        id: '',
        chargePerson: '',
        chargePersonStNum: '',
        originChargePersonId: ''
      },
      updateChargerLoading: false
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
    },
    handleUpdateCharger() {
      this.$refs.chargerRuleForm.validate(valid => {
        if (valid) {
          if (this.charger.chargePerson === this.currentRoom.chargePerson) {
            this.$message.warning('您已是当前房间的负责人')
            return
          }
          this.updateChargerLoading = true
          this.charger.id = this.currentRoom.id
          this.charger.originChargePersonId = this.currentRoom.chargePersonId
          roomApi.updateRoomCharger(this.charger).then(() => {
            this.updateChargerLoading = false
            this.currentRoom.chargePerson = this.charger.chargePerson
            this.updateCharger = false // 关闭表单
            this.charger = {
              chargePerson: '',
              chargePersonStNum: ''
            }
            this.$message.success("修改成功")
            // 发送修改成功的对象
            this.$emit("updateSuccess", this.currentRoom)
          }).catch(e => {
            this.updateChargerLoading = false
          })
        } else {
          this.$message.warning("请检查您输入的信息")
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
