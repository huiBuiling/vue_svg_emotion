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
      <!-- 放射渐变(径向渐变) -->
      <radialGradient id="ccclaymoji-grad-dark" r="93%" cx="20%" cy="20%">
        <stop offset="70%" :stop-color="head.color.baseColor" stop-opacity="0"></stop>
        <stop offset="97%" :stop-color="head.color.stopColor1" stop-opacity="1"></stop>
      </radialGradient>
      <radialGradient id="ccclaymoji-grad-light" r="65%" cx="28%" cy="20%">
        <stop offset="0%" :stop-color="head.color.stopColor2" stop-opacity="0.75"></stop>
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
          :flood-color="eye.shadowColor"
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
        <stop offset="20%" :stop-color="eye.stopColor1" stop-opacity="1"></stop>
        <stop offset="100%" :stop-color="eye.stopColor2" stop-opacity="0"></stop>
      </linearGradient>

      <!-- 嘴部灯光 -->
      <linearGradient id="mouth-light" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" :stop-color="mouth.lightColor" stop-opacity="1"></stop>
        <stop offset="100%" :stop-color="mouth.lightColor2" stop-opacity="0"></stop>
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
          :flood-color="mouth.shadowColor"
          :flood-opacity="mouth.shadowOpacity"
        ></feDropShadow>
      </filter>
    </defs>
    <g stroke-linecap="round">
      <!-- head 01 -->
      <!-- <path :d="head.d" fill="#86a600" opacity="0.25" filter="url(#ccclaymoji-blur)"></path>
        <path :d="head.d" :fill="head.baseColor"></path>
        <path :d="head.d" fill="url(#ccclaymoji-grad-dark)"></path>
        <path :d="head.d" fill="url(#ccclaymoji-grad-light)"></path> -->

      <!-- head 06 -->
      <!-- 阴影 -->
      <circle
        :r="head.r"
        :cx="head.cx"
        :cy="head.cy"
        :fill="head.color.shadowColor"
        opacity="0.25"
        filter="url(#ccclaymoji-blur)"
        transform="translate(-10, 60)"
      />
      <!-- translate 浏览器调试记得加px -->
      <!-- <path :d="head.d" :fill="head.color.shadowColor" opacity="0.25" filter="url(#ccclaymoji-blur)"></path> -->
      <circle :r="head.r" :cx="head.cx" :cy="head.cy" :fill="head.color.baseColor" />
      <circle :r="head.r" :cx="head.cx" :cy="head.cy" fill="url(#ccclaymoji-grad-dark)" />
      <circle :r="head.r" :cx="head.cx" :cy="head.cy" fill="url(#ccclaymoji-grad-light)" />

      <!-- eye -->
      <ellipse
        :rx="eye.left.rx"
        :ry="eye.left.ry"
        :cx="eye.left.cx"
        :cy="eye.left.cy"
        :fill="eye.baseColor"
        filter="url(#eye-shadow)"
      ></ellipse>
      <ellipse
        :rx="eye.left.rx"
        :ry="eye.left.ry"
        :cx="eye.left.cx"
        :cy="eye.left.cy"
        fill="url(#eye-light)"
        filter="url(#inner-blur)"
      ></ellipse>
      <ellipse
        :rx="eye.right.rx"
        :ry="eye.right.ry"
        :cx="eye.right.cx"
        :cy="eye.right.cy"
        :fill="eye.baseColor"
        filter="url(#eye-shadow)"
      ></ellipse>
      <ellipse
        :rx="eye.right.rx"
        :ry="eye.right.ry"
        :cx="eye.right.cx"
        :cy="eye.right.cy"
        fill="url(#eye-light)"
        filter="url(#inner-blur)"
      ></ellipse>

      <!-- 嘴巴 x,y -> d值变化 -->
      <path
        d="M325.5 516.5Q375.5 394.5 424.5 516.5 "
        :stroke-width="mouth.width"
        :stroke="mouth.baseColor"
        fill="none"
        filter="url(#mouth-shadow)"
      ></path>
      <!-- 嘴巴 灯光 -->
      <path
        d="M325.5 516.5Q375.5 394.5 424.5 516.5 "
        :stroke-width="mouth.lightWidth"
        stroke="url(#mouth-light)"
        fill="none"
        filter="url(#inner-blur)"
      ></path>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

interface VueColorAvatarProps {
  head: any
  mouth: any
  eye: any
}

const props = withDefaults(defineProps<VueColorAvatarProps>(), {
  head: {},
  mouth: {},
  eye: {},
})

const emit = defineEmits<{
  (e: 'change'): void
}>()

console.log(`output->props`, props)
// const name = computed(() => store.name)
// store.updateName('lee')

/**
 * svg： https://blog.csdn.net/Z_2010317/article/details/125854597
 * filter: 为 svg 元素添加阴影
 * - eg: filter="url(#mouth-shadow)"
 * 滤镜：
    * 类型：
        feBlend:与图像相结合的滤镜
        feColorMatrix:用于彩色滤光片转换
        feGaussianBlur:模糊滤镜
        feMerge:多滤镜叠加滤镜
        feOffset:过滤阴影
        feDistantLight:用于照明过滤
    * 模式：normal — 正常 | multiply — 正片叠底 | screen — 滤色 | darken — 变暗 | lighten— 变亮
    * 属性：
        x，y：提供左上角的坐标俩定义在哪里渲染滤镜效果(默认值:0)
        width,height：绘制滤镜容器的高度(默认都为 100%)
        result：用于定义一个滤镜效果的输出名字，以便将其用作另一个滤镜效果的输入(in)
        in：指定滤镜效果的输入源,可以是某个滤镜导出的result,也可以是下面6个值
 */

// 头部：类型，大小，回转
// const head = ref({
//   baseColor: 'hsl(205, 69%, 50%)',
//   shadowColor: '#0061a5',
//   d: 'M750 450.0000117855609C750 653.1879913252028 603.1879795396419 817.9028250847937 400 817.9028250847937C196.812915601023 817.9028250847937 50 653.1879913252028 50 450.0000117855609C50 246.81292738658385 196.812915601023 82.09719848632812 400 82.09719848632812C603.1879795396419 82.09719848632812 750 246.81292738658385 750 450.0000117855609Z',
//   r: 350,
//   cx: 400,
//   cy: 400,
//   size: 30,
//   type: 1,
//   // stopColor1: '#86a600',
//   // stopColor2: '#efff61',
//   stopColor1: 'hsl(205, 69%, 50%)',
//   stopColor2: '#6bbeff',
// })

// const head2 = ref({
//   baseColor: 'hsl(70, 69%, 50%)',
//   d: 'M585.5 400C585.5 513.495 513.495 605.5 400 605.5C286.5055 605.5 214.5 513.495 214.5 400C214.5 286.5055 286.5055 194.5 400 194.5C513.495 194.5 585.5 286.5055 585.5 400Z',
//   shadowD:
//     'M585.5 450C585.5 563.495 513.495 655.5 400 655.5C286.5055 655.5 214.5 563.495 214.5 450C214.5 336.5055 286.5055 244.5 400 244.5C513.495 244.5 585.5 336.5055 585.5 450Z',
//   path: [
//     // M750 450.0000117855609C750
//     // 653.1879913252028 603.1879795396419
//     // 817.9028250847937 400
//     // 817.9028250847937C196.812915601023
//     // 817.9028250847937 50
//     // 653.1879913252028 50
//     // 450.0000117855609C50 246.81292738658385
//     // 196.812915601023 82.09719848632812
//     // 400 82.09719848632812C603.1879795396419
//     // 82.09719848632812 750
//     // 246.81292738658385 750
//     // 450.0000117855609Z
//     { x: 'M497 399.99999958871194C497' },
//     { x: '459.34778934612433 459.3477897574124' },
//     { x: '507.4582206129707 400' },
//     { x: '507.4582206129707C340.65247169811323 507.4582206129707' },
//     { x: '303 459.34778934612433' },
//     { x: '303 399.99999958871194C303' },
//     { x: '340.6524712868251 340.65247169811323' },
//     { x: '292.5417785644531 400' },
//     { x: '292.5417785644531C459.3477897574124 292.5417785644531' },
//     { x: '497 340.6524712868251' },
//     { x: '497 399.99999958871194Z' },
//   ],
//   size: 30,
//   type: 1,
//   stopColor1: '#86a600',
//   stopColor2: '#efff61',
// })

// // 嘴巴：颜色，类型，宽度，倾斜度，微笑/皱眉，旋转，x,y
// const mouth = ref({
//   width: 30,
//   lightWidth: 15,
//   length: 30,
//   type: 1, // 'smile -> 1 /frown -> 2'
//   baseColor: 'hsl(3, 100%, 51%)',
//   shadowColor: '#c20000',
//   shadowOpacity: 0.9,
//   lightColor: '#ff9667',
//   lightColor2: 'hsl(3, 100%, 51%)',
//   rotation: 30,
//   positionX: 0,
//   positionY: 0,
// })

// // 左右眼: 颜色， 尺寸x,y，位置x,y， 类型
// const eye = ref({
//   baseColor: 'black',
//   x: 0,
//   y: 0,
//   shadowColor: '#000000',
//   shadowOpacity: 0.8,
//   stopColor1: '#ff5770', // #555555
//   stopColor2: 'black', // #ff9667
//   positionX: 0,
//   positionY: 0,
// })
</script>

<style lang="scss">
// .emoticon {
//   width: 300px;
//   height: 300px;
//   border: 1px dotted rgba(185, 118, 70, 0.25);
// }
</style>
