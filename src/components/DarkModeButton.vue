<script>
  export default {
    name: "DarkModeButton",
    mounted() {
      let item = localStorage.getItem("dark");
      this.dark = item != null && item === "true";
    },
    data() {
      return {
        dark: false
      }
    },
    methods: {
      darkModeSwitch() {
        const event = new Event("darkMode")
        this.dark = !this.dark;
        localStorage.setItem("dark", this.dark.toString());
        window.dispatchEvent(event);
      }
    }
  }
</script>

<template>
  <div>
    <va-button preset="secondary" color="#000000" style="font-weight: normal;" @click="darkModeSwitch">
      {{dark ? "切换浅色模式" : "切换深色模式"}}
    </va-button>
  </div>
</template>

<style scoped>

</style>