<template>
  <div class="base-container row">
    <div id="login-card" class="flex flex-col md5 lg3 sm12">
      <p style="font-size: xx-large; font-weight: lighter; margin-bottom: 1.5rem">登录</p>
      <va-input
          placeholder="用户名"
          v-model="username"
          class="input"
          :color="themeColor"
      />
      <va-input
          type="password"
          placeholder="密码"
          v-model="password"
          class="input"
          :color="themeColor"
      />
      <div style="min-width: 100%; display: flex; justify-content: center">
        <va-switch
            v-model="remember"
            :color="themeColor"
            label="记住我"
            left-label
            size="small"
        />
      </div>
      <va-button :color="themeColor" @click="loginBtn" style="min-width: 100%; margin-top: 15px; margin-bottom: 15px" :loading="showLoading">
        登录
      </va-button>
      <div style="display: flex; justify-content: center;">
        <va-button @click="$router.push('/register')" preset="secondary" :color="themeColor">
          注册
        </va-button>
        <va-button preset="secondary" @click="$router.push('/reset')" :color="themeColor">
          忘记密码
        </va-button>
      </div>
    </div>
  </div>
</template>
<script>
import {login} from "@/api/login"
import {THEME_COLOR} from "@/common/final";

export default {
  data() {
    return {
      username: "",
      password: "",
      remember: true,
      showLoading: false,
      themeColor: THEME_COLOR
    }
  },
  methods: {
    loginBtn() {
      this.showLoading = true;
      login(this.username, this.password, this.remember).then((resp) => {
        if (resp.data.code === 0) {
          localStorage.setItem("username", this.username);
          this.$router.push("/");
          this.$vaToast.init({message: '登录成功', color: 'success', closeable: false, duration: 3000})
        } else if (resp.data.code === -2) {
          this.$vaToast.init({message: '账号或密码错误', color: 'danger', closeable: false, duration: 3000})
          this.showLoading = false;
        } else {
          this.$vaToast.init({message: '登录失败', color: 'danger', closeable: false, duration: 3000})
          this.showLoading = false;
        }
      });
    }
  }
}
</script>
<style scoped>
#login-card {
  @media screen and (min-width: 768px) {
    border-radius: 1rem;
  }
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
}
</style>
