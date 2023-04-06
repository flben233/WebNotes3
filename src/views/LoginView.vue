<template>
  <div id="login">
      <va-card style="padding: 20px">
        <div style="display: flex; flex-flow: column;">
          <p style="font-size: xx-large; font-weight: lighter; margin-bottom: 20px">登录</p>
          <va-form
              style="display: flex; flex-flow: column;"
              tag="form"
              @submit.prevent="loginBtn"
          >
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
            <va-button type="submit" class="btn" :color="themeColor">
              登录
            </va-button>
          </va-form>
          <br/>
          <div style="align-self: center">
            <va-button @click="$router.push('/register')" preset="secondary" style="padding: 0" :color="themeColor">
              注册
            </va-button>
            <va-button preset="secondary" @click="$router.push('/reset')" :color="themeColor">
              忘记密码
            </va-button>
          </div>
          <va-progress-bar indeterminate :color="themeColor" :rounded="false" v-if="showLoading" size="small"/>
        </div>
      </va-card>
  </div>
</template>
<script>
import {VaCard, VaForm} from "vuestic-ui";
import {login} from "@/api/login"
import {THEME_COLOR} from "@/common/final";

export default {
  components: {VaForm, VaCard},
  data() {
    return {
      username: "",
      password: "",
      remember: false,
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
          this.$vaToast.init({ message: '登录成功', color: 'success', closeable: false, duration: 3000 })
        } else if (resp.data.code === -2) {
          this.$vaToast.init({ message: '账号或密码错误', color: 'danger', closeable: false, duration: 3000 })
          this.showLoading = false;
        } else {
          this.$vaToast.init({ message: '登录失败', color: 'danger', closeable: false, duration: 3000 })
          this.showLoading = false;
        }
      });
    }
  }
}
</script>
<style scoped>

</style>
