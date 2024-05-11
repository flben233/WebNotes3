<template>
  <div :style="sideBar" class="side">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  mounted() {
    if (innerWidth < 1024) {
      this.sideBar = this.sideBarMobile;
    } else {
      this.sideBar = this.sideBarDefault;
    }
  },
  data() {
    return {
      expended: true,
      sideBar: {},
      sideBarDefault: {
        width: "16vw",
        marginTop: "2vh",
        marginLeft: "1vw"
      },
      sideBarMin: {
        width: "0",
        marginLeft: "0",
        marginTop: "2vh",
        height: "100%"
      },
      sideBarMobile: {
        marginTop: "2vh",
        width: "96vw",
        marginLeft: "2vw"
      }
    }
  },
  methods: {
    toggleSideBar() {
      if (this.expended) {
        this.sideBar = this.sideBarMin;
        this.expended = false;
      } else {
        if (innerWidth < 1024) {
          this.sideBar = this.sideBarMobile;
        } else {
          this.sideBar = this.sideBarDefault;
        }
        this.expended = true;
      }
    }
  }
}
</script>

<style>
.side {
  overflow: clip;
  transition: all 0.5s;
}
</style>