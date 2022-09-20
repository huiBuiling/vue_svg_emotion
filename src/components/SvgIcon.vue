<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:svgjs="http://svgjs.dev/svgjs"
    viewBox="0 0 800 800"
  >
    <!-- @click="emit('change')" -->
    <defs>
      <!-- head 右下侧 放射渐变(径向渐变) -->
      <radialGradient id="ccclaymoji-grad-dark" r="93%" cx="20%" cy="20%">
        <stop offset="70%" :stop-color="head.color.baseColor" stop-opacity="0"></stop>
        <stop
          offset="97%"
          :stop-color="isCustomHead == 'no' ? getLightenDarkenColor(head.color.baseColor, -54) : head.color.stopColor1"
          stop-opacity="1"
        ></stop>
      </radialGradient>
      <!-- head 左上侧 -->
      <radialGradient id="ccclaymoji-grad-light" r="65%" cx="28%" cy="20%">
        <stop
          offset="0%"
          :stop-color="isCustomHead == 'no' ? getLightenDarkenColor(head.color.baseColor, +50) : head.color.stopColor2"
          stop-opacity="0.75"
        ></stop>
        <stop offset="100%" :stop-color="head.color.baseColor" stop-opacity="0"></stop>
      </radialGradient>
      <!-- head -->
      <filter
        id="ccclaymoji-blur"
        x="-100%"
        y="-100%"
        width="400%"
        height="400%"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feGaussianBlur
          stdDeviation="30"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          in="SourceGraphic"
          edgeMode="none"
          result="blur"
        ></feGaussianBlur>
      </filter>
      <filter
        id="inner-blur"
        x="-100%"
        y="-100%"
        width="400%"
        height="400%"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feGaussianBlur
          stdDeviation="2"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          in="SourceGraphic"
          edgeMode="none"
          result="blur"
        ></feGaussianBlur>
      </filter>

      <!-- 眼睛阴影 -->
      <filter
        id="eye-shadow"
        x="-100%"
        y="-100%"
        width="400%"
        height="400%"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feDropShadow
          stdDeviation="10"
          dx="10"
          dy="10"
          :flood-color="eye.color.baseColor"
          :flood-opacity="eye.shadowOpacity"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          result="dropShadow"
        ></feDropShadow>
      </filter>

      <!-- 眼睛: 包含上部分叠加色 -> 眼影 -->
      <linearGradient id="eye-light" gradientTransform="rotate(-25)" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop
          offset="20%"
          :stop-color="isCustomEye == 'eye_no' ? getLightenDarkenColor(eye.color.baseColor, +50) : eye.color.stopColor1"
          stop-opacity="1"
        ></stop>
        <stop
          offset="100%"
          :stop-color="isCustomEye == 'eye_no' ? eye.color.baseColor : eye.color.stopColor2"
          stop-opacity="0"
        ></stop>
      </linearGradient>

      <!-- 嘴部灯光 -->
      <linearGradient id="mouth-light" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" :stop-color="mouth.color.lightColor" stop-opacity="1"></stop>
        <stop offset="100%" :stop-color="mouth.color.lightColor2" stop-opacity="0"></stop>
      </linearGradient>

      <!-- 嘴部阴影 -->
      <filter
        id="mouth-shadow"
        x="-100%"
        y="-100%"
        width="400%"
        height="400%"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feDropShadow
          stdDeviation="10"
          dx="10"
          dy="10"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          result="dropShadow"
          :flood-color="mouth.color.shadowColor"
          :flood-opacity="mouth.shadowOpacity"
        ></feDropShadow>
      </filter>
    </defs>
    <g stroke-linecap="round">
      <!-- head -->
      <HeadCon :data="head" :type="activeHeadSty" />

      <!-- eye -->
      <g v-for="item in ['left', 'right']" :key="item">
        <ellipse
          :rx="eye[item].rx + 20"
          :ry="eye[item].ry + 20"
          :cx="eye[item].cx + 130"
          :cy="eye[item].cy + 180"
          :fill="eye.color.baseColor"
          filter="url(#eye-shadow)"
        ></ellipse>
        <ellipse
          :rx="eye[item].rx + 20"
          :ry="eye[item].ry + 20"
          :cx="eye[item].cx + 130"
          :cy="eye[item].cy + 180"
          fill="url(#eye-light)"
          filter="url(#inner-blur)"
        ></ellipse>
      </g>

      <!-- mouth x,y -> d值变化 -->
      <path
        :d="mouthPath"
        :stroke-width="mouth.width"
        :stroke="mouth.color.baseColor"
        fill="none"
        filter="url(#mouth-shadow)"
        :transform="`rotate(${mouth.rotation}, 400, 400)`"
      ></path>
      <!-- mouth 灯光 -->
      <path
        :d="mouthPath"
        :stroke-width="mouth.lightWidth"
        stroke="url(#mouth-light)"
        fill="none"
        filter="url(#inner-blur)"
        :transform="`rotate(${mouth.rotation}, 400, 400)`"
      ></path>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { getLightenDarkenColor } from '@/utils/index'

import HeadCon from './HeadCon.vue'

interface VueColorAvatarProps {
  head: any
  mouth: any
  eye: any
  activeHeadSty: string
  isCustomHead: string | 'ok' | 'no'
  isCustomEye: string | 'eye_ok' | 'eye_no'
}

const props = withDefaults(defineProps<VueColorAvatarProps>(), {
  head: {},
  mouth: {},
  eye: {},
  activeHeadSty: 'Head01',
  isCustomHead: 'no',
  isCustomEye: 'eye_no',
})

console.log(`output->svgCon`, props)

const emit = defineEmits<{
  (e: 'change'): void
}>()

// console.log(`output->props`, props.mouth.path)
// const name = computed(() => store.name)
// store.updateName('lee')

// 嘴巴：颜色，类型，宽度，倾斜度，微笑/皱眉，旋转，x,y
const mouthPath = computed(() => {
  const { s, c, e } = props.mouth.path
  console.log(`output->mouthPath`, `M${s} 512.5Q${c} 562.5 ${e} 512.5`)
  // min: M416 512.5Q466 562.5 366 512.5
  // cen: M350 512.5Q400 562.5 450 512.5
  // max: M250 512.5Q300 562.5 550 512.5
  return `M${s} 512.5Q${c} 562.5 ${e} 512.5`
})
</script>
