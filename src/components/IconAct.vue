<template>
  <svg-icon v-if="props.icon" :name="props.icon" :class="props.class" />
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: ''
  }
})
</script>
