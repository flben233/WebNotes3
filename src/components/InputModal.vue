<script>
import Title from "@/components/Title.vue";
import {THEME_COLOR} from "@/common/final";

export default {
  name: "InputModal",
  components: {Title},
  props: ['show', 'title', 'input'],
  emits: ['update:show', 'update:input', 'apply', 'close'],
  data() {
    return {
      themeColor: THEME_COLOR
    }
  },
}
</script>

<template>
  <va-modal :model-value="show" @change="$emit('update:show', $event.target.value)" hide-default-actions>
    <template #header>
      <Title>{{ title }}</Title>
    </template>
    <va-input :model-value="input" @change="$emit('update:input', $event.target.value)" :color="themeColor"></va-input>
    <template #footer>
      <va-button :color="themeColor" text-color="#ffffff" @click="$emit('apply')" style="margin-right: 20px">
        提交
      </va-button>
      <va-button preset="secondary" :color="themeColor" @click="$emit('close')">
        关闭
      </va-button>
    </template>
  </va-modal>
</template>

<style scoped>

</style>