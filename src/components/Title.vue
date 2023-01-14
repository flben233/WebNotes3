<template>
  <p id="title">
    <slot/>
  </p>
</template>

<script>
export default {
  name: "Title",
  props: ['title']
}
</script>

<style scoped>
#title {
  white-space:nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 700;
  padding: 0 0 20px;
}
</style>