<template>
  <div class="emoticon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:svgjs="http://svgjs.dev/svgjs"
      viewBox="0 0 800 800"
    >
      <defs>
        <!-- <radialGradient id="ccclaymoji-grad-dark" r="93%" cx="20%" cy="20%">
      <stop class="bgColor" offset="70%" stop-color="hsl(70, 69%, 50%)" stop-opacity="0"></stop>
      <stop offset="97%" stop-color="#86a600" stop-opacity="1"></stop>
    </radialGradient>
    <radialGradient id="ccclaymoji-grad-light" r="65%" cx="28%" cy="20%">
      <stop offset="0%" stop-color="#efff61" stop-opacity="0.75"></stop>
      <stop offset="100%" stop-color="hsl(70, 69%, 50%)" stop-opacity="0"></stop>
    </radialGradient> -->
        <!-- <filter
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
    </filter> -->
        <!-- <filter
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
    </filter> -->
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
        <!-- 眼睛灯光 -->
        <!-- <linearGradient
          id="eye-light"
          gradientTransform="rotate(-25)"
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
        >
          <stop offset="20%" stop-color="#555555" stop-opacity="1"></stop>
          <stop offset="100%" stop-color="black" stop-opacity="0"></stop>
        </linearGradient> -->

        <!-- 嘴部灯光 -->
        <linearGradient id="mouth-light" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#ff9667" stop-opacity="1"></stop>
          <stop
            offset="100%"
            stop-color="hsl(3, 100%, 51%)"
            stop-opacity="0"
          ></stop>
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
        <!-- bg 叠加阴影 -->
        <!-- <path
          d="M585.5 450C585.5 563.495 513.495 655.5 400 655.5C286.5055 655.5 214.5 563.495 214.5 450C214.5 336.5055 286.5055 244.5 400 244.5C513.495 244.5 585.5 336.5055 585.5 450Z "
          fill="#86a600"
          opacity="0.25"
          filter="url(#ccclaymoji-blur)"
        ></path> -->
        <!-- bg -->
        <path
          d="M585.5 399.99999617554647C585.5 507.6896253315567 507.68962915601026 594.9884872241398 400 594.9884872241398C292.3108452685422 594.9884872241398 214.5 507.6896253315567 214.5 399.99999617554647C214.5 292.3108414440887 292.3108452685422 205.01150512695312 400 205.01150512695312C507.68962915601026 205.01150512695312 585.5 292.3108414440887 585.5 399.99999617554647Z "
          :fill="bgColor"
        ></path>
        <!-- <path
      d="M585.5 399.99999617554647C585.5 507.6896253315567 507.68962915601026 594.9884872241398 400 594.9884872241398C292.3108452685422 594.9884872241398 214.5 507.6896253315567 214.5 399.99999617554647C214.5 292.3108414440887 292.3108452685422 205.01150512695312 400 205.01150512695312C507.68962915601026 205.01150512695312 585.5 292.3108414440887 585.5 399.99999617554647Z "
      fill="url(#ccclaymoji-grad-dark)"
    ></path> -->
        <!-- <path
      d="M585.5 399.99999617554647C585.5 507.6896253315567 507.68962915601026 594.9884872241398 400 594.9884872241398C292.3108452685422 594.9884872241398 214.5 507.6896253315567 214.5 399.99999617554647C214.5 292.3108414440887 292.3108452685422 205.01150512695312 400 205.01150512695312C507.68962915601026 205.01150512695312 585.5 292.3108414440887 585.5 399.99999617554647Z "
      fill="url(#ccclaymoji-grad-light)"
    ></path> -->
        <!-- filter="url(#eye-shadow)" -->
        <ellipse
          rx="18"
          ry="25"
          cx="284"
          cy="375"
          :fill="eye.baseColor"
          filter="url(#eye-shadow)"
        ></ellipse>
        <!-- <ellipse
          rx="18"
          ry="25"
          cx="284"
          cy="375"
          fill="url(#eye-light)"
          filter="url(#inner-blur)"
        ></ellipse> -->
        <ellipse
          rx="52.5"
          ry="54"
          cx="435"
          cy="375"
          :fill="eye.baseColor"
          filter="url(#eye-shadow)"
        ></ellipse>
        <!-- <ellipse
          rx="52.5"
          ry="54"
          cx="435"
          cy="375"
          fill="url(#eye-light)"
          filter="url(#inner-blur)"
        ></ellipse> -->
        <!-- 嘴巴 x,y -> d值变化 -->
        <path
          d="M325.5 516.5Q375.5 394.5 424.5 516.5 "
          :stroke-width="mouth.width"
          :stroke="mouth.baseColor"
          fill="none"
          filter="url(#mouth-shadow)"
        ></path>
        <!-- 嘴巴 灯光 -->
        <!-- <path
      d="M325.5 516.5Q375.5 394.5 424.5 516.5 "
      stroke-width="6.666666666666667"
      stroke="url(#mouth-light)"
      fill="none"
      filter="url(#inner-blur)"
    ></path> -->
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import { widgetStore } from '@/store/icons'

const store = widgetStore()
console.log(`output->stroe`, store)
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
const bgColor = ref('hsl(70, 69%, 50%)')

// 头部：类型，大小，回转
const head = ref({
  baseColor: 'hsl(3, 100%, 51%)',
  size: 30,
  type: 1,
})

// 嘴巴：颜色，类型，宽度，倾斜度，微笑/皱眉，旋转，x,y
const mouth = ref({
  width: 30,
  length: 30,
  type: 1, // 'smile -> 1 /frown -> 2'
  baseColor: 'hsl(3, 100%, 51%)',
  shadowColor: '#c20000',
  shadowOpacity: 0.9,
  rotation: 30,
  positionX: 0,
  positionY: 0,
})

// 左右眼: 颜色， 尺寸x,y，位置x,y， 类型
const eye = ref({
  baseColor: 'black',
  x: 0,
  y: 0,
  shadowColor: '#c20000',
  shadowOpacity: 0.9,
  positionX: 0,
  positionY: 0,
})
</script>

<style lang="scss"></style>
