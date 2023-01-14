<template>
  <div id="login">
      <va-card style="padding: 20px">
        <div style="display: flex; flex-flow: column;">
          <p style="font-size: xx-large; font-weight: lighter; margin-bottom: 20px">登录</p>
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
            <va-switch v-model="remember" :color="themeColor" label="记住我" left-label size="small" style="align-self: center"/>
          <br/>
          <va-button @click="loginBtn" class="btn" color="#39c5bb">
            登录
          </va-button>
          <br/>
          <div style="align-self: center">
            <va-button @click="$router.push('/register')" preset="secondary" style="padding: 0" :color="themeColor">
              注册
            </va-button>
            <va-button preset="secondary" @click="$router.push('/reset')" :color="themeColor">
              忘记密码
            </va-button>
          </div>
        </div>
      </va-card>
  </div>
</template>
<script>
import { VaCard } from "vuestic-ui";
import {login} from "@/api/login"
import {THEME_COLOR} from "@/common/final";

export default {
  components: {VaCard},
  data() {
    return {
      username: "",
      password: "",
      remember: false,
      themeColor: THEME_COLOR
    }
  },
  methods: {
    loginBtn() {
      login(this.username, this.password, this.remember).then((resp) => {
        if (resp.data.code === 0) {
          this.$vaToast.init({ message: '登录成功', color: 'success', closeable: false, duration: 3000 })
          localStorage.setItem("username", this.username);
          this.$router.push("/")
        } else if (resp.data.code === -2) {
          this.$vaToast.init({ message: '账号或密码错误', color: 'danger', closeable: false, duration: 3000 })
        } else {
          this.$vaToast.init({ message: '登录失败', color: 'danger', closeable: false, duration: 3000 })
        }
      });
    }
  }
}
</script>
<style scoped>

</style>
