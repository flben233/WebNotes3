<script>
import {THEME_COLOR} from "@/common/final";

export default {
  name: "AdminCard",
  methods: {
    THEME_COLOR() {
      return THEME_COLOR
    }
  },
  data() {
    return {
      style: {
        color: null
      }
    }
  },
  watch: {
    stripe: {
      handler: function (val) {
        if (val) {
          this.style.color = this.THEME_COLOR();
        } else {
          this.style.color = null;
        }
      }
    }
  },
  props: ["user", "stripe"]
}
</script>

<template>
  <va-card class="admin-card" outlined :style="style">
    <va-card-title>
      <p>{{ user.username }}</p>
    </va-card-title>
    <va-card-content>
      <p>{{ user.mail }}</p>
    </va-card-content>
  </va-card>
</template>

<style scoped>
.admin-card {
  border-radius: 1rem;
  cursor: pointer;
  overflow: clip;
  max-height: 110px;
}
</style>