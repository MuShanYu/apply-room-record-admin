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
          <h2>欢迎使用后台管理系统！</h2>
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


    <div class="notification">
      <div class="notification__body">
        <img
          src="@/assets/check-circle.svg"
          alt="Success"
          class="notification__icon"
        >
        账号密码修改与找回，请通过客户端小程序《房间预约与人员流动统计》修改 &#128640;
      </div>
      <div class="notification__progress"></div>
    </div>
  </div>
</template>

<script>
import '@/styles/login.css'

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


<style lang="scss" scoped>
.notification {
  position: absolute;
  width: max-content;
  left: 0;
  right: 0;
  top: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.375rem;
  background-color: #313e2c;
  color: #aaec8a;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(1.875rem);
  opacity: 0;
  visibility: hidden;
  animation: fade-in 7s linear;
}

.notification__icon {
  height: 1.625rem;
  width: 1.625rem;
  margin-right: 0.25rem;
}

.notification__body {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 0.5rem;
}

.notification__progress {
  position: absolute;
  left: 0.25rem;
  bottom: 0.25rem;
  width: calc(100% - 0.5rem);
  height: 0.2rem;
  transform: scaleX(0);
  transform-origin: left;
  background: linear-gradient(
      to right,
      #313e2c,
      #aaec8a
  );
  border-radius: inherit;
  animation: progress 6.5s 0.3s linear;
}

@keyframes fade-in {
  5% {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  95% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progress {
  to {
    transform: scaleX(1);
  }
}
</style>
