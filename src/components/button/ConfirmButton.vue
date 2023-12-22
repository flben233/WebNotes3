<template>
  <va-popover
      :placement="placement"
      trigger="click"
  >
    <va-button
        :size="size"
        class="mr-6 mb-2"
        :round="round"
        :icon="icon"
        :gradient="gradient"
        :color="color"
    >
      <slot/>
    </va-button>

    <template #body>
      <p>确定？</p>
      <va-button
          :size="size"
          :color="color"
          class="mr-6 mb-2"
          @click="$emit('confirm')"
      >确定</va-button>
    </template>
  </va-popover>
</template>

<script>
export default {
  name: "ConfirmButton",
  props: ['color', 'round', 'gradient', 'size', 'icon', 'placement'],
  emit: ['confirm']
}
</script>

<style scoped>

</style>