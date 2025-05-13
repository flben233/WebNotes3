<script>
import {THEME_COLOR} from "@/common/final";

export default {
  name: "DarkModeButton",
  mounted() {
    let item = localStorage.getItem("dark");
    this.dark = item != null && item === "true";
  },
  data() {
    return {
      dark: false,
      themeColor: THEME_COLOR
    }
  },
  methods: {
    darkModeSwitch() {
      const event = new Event("darkMode")
      localStorage.setItem("dark", this.dark.toString());
      window.dispatchEvent(event);
    }
  }
}
</script>

<template>
  <div class="dark-switch">
    <va-switch
        v-model="dark"
        :color="themeColor"
        @click="darkModeSwitch"
        round
    >
      <template #innerLabel>
        <va-icon
            color="warning"
            size="24px"
            :name="dark ? 'dark_mode' : 'light_mode'"
        />
      </template>

    </va-switch>
<!--    <va-button preset="secondary" color="#000000" style="font-weight: normal;" @click="darkModeSwitch">-->
<!--      {{ dark ? "切换浅色模式" : "切换深色模式" }}-->
<!--    </va-button>-->
  </div>
</template>

<style scoped>
  .dark-switch {
    overflow: hidden;
  }
</style>