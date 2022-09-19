<template>
  <!-- 阴影色 -->
  <circle
    :r="data.r"
    :cx="data.cx"
    :cy="data.cy"
    :fill="data.color.baseColor"
    opacity="0.25"
    filter="url(#ccclaymoji-blur)"
    transform="translate(-10, 60)"
  />
  <!-- translate 浏览器调试记得加px -->
  <!-- <path :d="head.d" :fill="head.color.shadowColor" opacity="0.25" filter="url(#ccclaymoji-blur)"></path> -->
  <circle :r="data.r" :cx="data.cx" :cy="data.cy" :fill="data.color.baseColor" />
  <circle :r="data.r" :cx="data.cx" :cy="data.cy" fill="url(#ccclaymoji-grad-dark)" />
  <circle :r="data.r" :cx="data.cx" :cy="data.cy" fill="url(#ccclaymoji-grad-light)" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface VueColorAvatarProps {
  data: any
}

const props = withDefaults(defineProps<VueColorAvatarProps>(), {
  data: {},
})

const emit = defineEmits<{
  (e: 'change'): void
}>()

console.log(`output->props`, props)
</script>

<!-- <style lang="scss"></style> -->
