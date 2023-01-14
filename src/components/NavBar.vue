<template>
  <va-navbar color="#ffffff" style="height: 5.5vh">
    <template #left>
      <va-button preset="secondary" color="#39c5bb" @click="$emit('click-left')">
        <va-icon name="menu"/>
      </va-button>
    </template>
    <template #right>
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
          <va-button preset="secondary" color="#000000" style="font-weight: normal;" @click="$emit('click-center')">个人中心</va-button>
          <br/>
          <va-button preset="secondary" color="#000000" style="font-weight: normal;" @click="$emit('click-logout')">退出登录</va-button>
        </va-button-dropdown>
      </va-navbar-item>
    </template>
  </va-navbar>
</template>

<script>
export default {
  name: "NavBar",
  props: ['username'],
  emits: ['click-left', 'click-logout', 'click-center']
}
</script>

<style scoped>

</style>