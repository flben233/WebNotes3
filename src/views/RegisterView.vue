<template>
  <div id="login">
    <va-card style="padding: 20px">
      <div style="display: flex; flex-flow: column;">
        <p style="font-size: xx-large; font-weight: lighter; margin-bottom: 20px">注册</p>
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
        <va-input
            placeholder="邮箱"
            v-model="email"
            class="input"
            :color="themeColor"
        />
        <va-input
            placeholder="验证码"
            v-model="code"
            class="input"
            :color="themeColor"
        />
        <va-button :disabled="disable" @click="codeBtn" preset="secondary" style="padding: 0" :color="themeColor">
          获取验证码
        </va-button>
        <br/>
        <va-button @click="registerBtn" class="btn" :color="themeColor">
          注册
        </va-button>
        <br/>
      </div>
    </va-card>
  </div>
</template>

<script>
import { VaCard } from "vuestic-ui";
import {THEME_COLOR} from "@/common/final";
import {code, register} from "../api/login";
export default {
  components: {VaCard},
  data() {
    return {
      username: "",
      password: "",
      email: "",
      code: "",
      disable: false,
      themeColor: THEME_COLOR
    }
  },
  methods: {
    codeBtn() {
      let pattern = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if(this.email !== '' && pattern.test(this.email)){
        code(this.email).then(() => {
          this.$vaToast.init({ message: '验证码获取成功', color: 'success', closeable: false, duration: 3000 })
        });
        this.disable = true;
        this.$vaToast.init({ message: '已向服务器提交请求，请等待，30秒后可再次获取', color: 'primary', closeable: false, duration: 3000 })
        setTimeout(()=>{this.disable=false}, 30000)
      }else {
        this.$vaToast.init({ message: '请输入正确邮箱', color: 'danger', closeable: false, duration: 3000 })
      }
    },
    registerBtn() {
      register(this.username, this.password, this.email, this.code).then((resp) => {
        if(resp.data.code === 0){
          this.$vaToast.init({ message: '注册成功', color: 'success', closeable: false, duration: 3000 })
          this.$router.push('/login')
        }else if(resp.data.code === -1){
          this.$vaToast.init({ message: '验证码错误', color: 'error', closeable: false, duration: 3000 })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>