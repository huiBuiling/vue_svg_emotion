<template>
  <component :is="type" :data="head" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface VueColorAvatarProps {
  head: any
  type: string
}

const props = withDefaults(defineProps<VueColorAvatarProps>(), {
  head: {},
  type: 'Head01',
})

const emit = defineEmits<{
  (e: 'change'): void
}>()

console.log(`output->headCon`, props)

// const comName = ref('Head01')
</script>

<script lang="ts">
import Head01 from './head/Head01.vue'
import Head02 from './head/Head02.vue'
import Head06 from './head/Head06.vue'

export default {
  components: {
    Head01,
    Head02,
    Head06,
  },
}
</script>

<!-- <style lang="scss"></style> -->
