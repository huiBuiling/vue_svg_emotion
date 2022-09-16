<template>
  <component :is="comName" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const comName = ref('Head01')
</script>

<script lang="ts">
import Head01 from './head/Head01.vue'
import Head02 from './head/Head02.vue'

export default {
  components: {
    Head01,
    Head02,
  },
}
</script>

<!-- <style lang="scss"></style> -->
