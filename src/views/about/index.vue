<template>
  <div style="padding: 20px;color: #606266;line-height: 1.5;">
    <p>
      项目名称：房间预约与让人员流动统计。
    </p>
    <p>
      项目介绍：项目采用主流前后端分离开发，采用Java语言开发。客户端分为管理端与小程序端。使用对象主要为桂电三院师生，主要用于房间线上预约使用，房间人员进出统计，房间人员签到统计。
    </p>
    <p>
      项目主要技术：Spring Boot、MyBatis Dynamic SQL、Redis、Swagger、Sa-Token等。
    </p>
   <p>
     项目地址：
     <ul>
       <li> <el-link href="https://github.com/MuShanYu/apply-room-record-admin" type="primary" target="_blank">管理端</el-link></li>
       <li><el-link href="https://github.com/MuShanYu/apply-room-record-app" type="primary" target="_blank">小程序端</el-link></li>
       <li><el-link href="https://github.com/MuShanYu/apply-room-record" type="primary" target="_blank">后端</el-link></li>
     </ul>
   </p>
   <p>
     注：小程序端包含房间审批功能。
   </p>
  <p>
    <el-image
      style="width: 200px; height: 200px"
      src="https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/admin-qrcode.jpg"
      fit="cover"></el-image>
  </p>
  </div>
</template>

<script>
  export default {
    name: 'About',
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style scoped lang="scss">

</style>
