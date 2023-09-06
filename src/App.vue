<script>
import {RouterView} from 'vue-router'

export default {
  components: {RouterView},
  mounted() {
    window.addEventListener("darkMode", (e) => {
      let item = localStorage.getItem("dark");
      let htmlStyle = document.documentElement.style;
      let imgArr = document.getElementsByTagName("img");
      let videoArr = document.getElementsByTagName("video");
      let codeArr = document.getElementsByTagName("code");
      let newArr = [...imgArr, ...videoArr, ...codeArr];
      if (item === "true") {
        htmlStyle.filter = "invert(0.9) hue-rotate(180deg)";
        for (let element of newArr)
          element.style.filter += "invert(100%) hue-rotate(180deg) contrast(100%)";
      } else {
        htmlStyle.filter = null;
        for (let element of newArr) {
          element.style.filter = element.style.filter.replaceAll("invert(100%) hue-rotate(180deg) contrast(100%)", "");
        }
      }
    })
  },
  data() {
    return {
      theme: "default"
    }
  }
}
</script>

<template>
  <div id="app" :data-theme="theme">
    <RouterView class="main"/>
  </div>
</template>

<style>
#app {
  background: #f0f0f0;
  height: 100%;
  width: 100%;
  position: fixed;
}

</style>
