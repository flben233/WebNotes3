<template>
  <div style="height: 5.5vh; background-color: white; display: flex; align-items: center; justify-content: space-between;
              padding-right: 1vw; padding-left: 1vw">
    <va-button preset="secondary" color="#39c5bb" @click="$emit('click-left')">
      <va-icon name="menu"/>
    </va-button>
    <va-navbar-item>
      <va-avatar size="small" color="#39c5bb" text-color="#ffffff">
        {{ username.charAt(0) }}
      </va-avatar>
      <va-button-dropdown
          preset="secondary"
          :label="username"
          text-color="#000000"
          color="#ffffff"
      >
        <va-button preset="secondary" color="#000000" style="font-weight: normal;" @click="$emit('click-center')">
          个人中心
        </va-button>
        <br/>
        <DarkModeButton/>
        <va-button preset="secondary" color="#000000" style="font-weight: normal;" @click="$emit('click-logout')">
          退出登录
        </va-button>
      </va-button-dropdown>
    </va-navbar-item>
  </div>
</template>

<script>
import DarkModeButton from "@/components/DarkModeButton.vue";

export default {
  name: "NavBar",
  components: {DarkModeButton},
  props: ['username'],
  emits: ['click-left', 'click-logout', 'click-center']
}
</script>

<style scoped>

</style>