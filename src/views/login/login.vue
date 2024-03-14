<template>
  <div class="form-wrapper">
    <div class="info-side">
    </div>

    <div class="form-side">
      <div class="my-form">
        <div class="form-welcome-row">
          <div>
            <img src="https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/logo.png" alt="Logo" class="logo">
          </div>
          <h1>房间预约与人员流动统计</h1>
        </div>
        <div class="divider">
          <div class="divider-line"></div>
          Manage
          <div class="divider-line"></div>
        </div>
        <div class="text-field">
          <label for="email">学号/工号</label>
          <input maxlength="16" v-model="loginForm.stuNum" type="text" name="stuNum" autocomplete="off"
                 placeholder="请输入您的学号/工号">
        </div>
        <div class="text-field">
          <label for="password">密码</label>
          <input maxlength="16" v-model="loginForm.pwd" type="password" name="password"
                 placeholder="请输入您的登录密码">
        </div>
        <button @click="handleLogin" v-loading="loading" class="my-form__button" type="button">
          登 录
        </button>
        <div class="rights"> ©2023 MuShanYu All Rights Reserved.</div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/styles/login.css'
import fa from "element-ui/src/locale/lang/fa";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        stuNum: "",
        pwd: "",
        device: 'pc'
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    checkForm() {
      if (!/^[0-9]{6,16}$/.test(this.loginForm.stuNum.trim())) {
        this.$message.error('请输入正确的学号')
        return false
      }
      if (this.loginForm.pwd.length < 4 || this.loginForm.pwd.length > 16) {
        this.$message.error('密码的长度在4~16之间')
        return false
      }
      return true
    },
    handleLogin() {
      if (this.checkForm()) {
        this.loading = true;
        this.$store.dispatch("user/login", this.loginForm)
          .then(() => {
            this.$router.push({path: this.redirect || "/"});
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>


<style scoped>

</style>
