<template>
  <!-- 阴影 -->
  <circle
    :r="head.head.r"
    :cx="head.head.cx"
    :cy="head.head.cy"
    :fill="head.head.color.shadowColor"
    opacity="0.25"
    filter="url(#ccclaymoji-blur)"
    transform="translate(-10, 60)"
  />
  <!-- translate 浏览器调试记得加px -->
  <!-- <path :d="head.d" :fill="head.color.shadowColor" opacity="0.25" filter="url(#ccclaymoji-blur)"></path> -->
  <circle :r="head.head.r" :cx="head.head.cx" :cy="head.head.cy" :fill="head.head.color.baseColor" />
  <circle :r="head.head.r" :cx="head.head.cx" :cy="head.head.cy" fill="url(#ccclaymoji-grad-dark)" />
  <circle :r="head.head.r" :cx="head.head.cx" :cy="head.head.cy" fill="url(#ccclaymoji-grad-light)" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface VueColorAvatarProps {
  head: any
}

const props = withDefaults(defineProps<VueColorAvatarProps>(), {
  head: {},
})

const emit = defineEmits<{
  (e: 'change'): void
}>()

console.log(`output->props`, props)
</script>

<!-- <style lang="scss"></style> -->
