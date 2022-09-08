<template>
  <div class="home">
    <div class="home_line"></div>
    <div class="center">
      <div class="icon_con">
        <SvgIcon :head="head" :mouth="mouth" :eye="eye" @change="tips()" />
      </div>
    </div>

    <!-- 可视化块 -->
    <div class="right">
      <!-- head -->
      <div class="view">
        <div class="t_title">头部</div>
        <div class="t_input">
          <span>大小</span>
          <input
            v-model="head.r"
            type="range"
            name="points"
            min="0"
            :max="head.maxW"
            :style="{ backgroundSize: `${(head.r / head.maxW) * 100}%` }"
            @change="handleSize($event, 'head', 'r')"
          />
        </div>

        <div v-for="item in Object.keys(head.color)" :key="item" class="t_color">
          <span>{{ colorText[item] }}</span>
          <!-- 默认是哪种类型颜色就会输出对应类型颜色 -->
          <v3-color-picker
            btn
            size="medium"
            :value="head.color[item] || ''"
            @change="changeColor($event, 'head', item)"
          />
        </div>
      </div>

      <!-- eye -->
      <div class="view">
        <div class="t_title">眼睛</div>
        <!-- 左眼，右眼 -->
        <div v-for="item in Object.keys(eye.left)" :key="item" class="t_input">
          <span>大小: {{ percent(eye.left[item], eyeMin(item)) }}</span>
          <input
            v-model="eye.left[item]"
            type="range"
            :name="item"
            :min="eyeMin(item).min"
            :max="eyeMin(item).max"
            :style="{ backgroundSize: percent(eye.left[item], eyeMin(item)) }"
            @change="handleSize($event, 'eye', item, 'left')"
          />
        </div>

        <div v-for="item in Object.keys(eye.color)" :key="item" class="t_color">
          <span>{{ colorText[item] }}</span>
          <!-- 默认是哪种类型颜色就会输出对应类型颜色 -->
          <v3-color-picker
            btn
            size="medium"
            :value="eye.color[item] || ''"
            @change="changeColor($event, 'eye', item)"
          />
        </div>
      </div>

      <!-- <div class="view">
        <div class="t_title">嘴巴</div>
        <div class="t_input">
          <span>大小</span>
          <input
            v-model="radius"
            type="range"
            name="points"
            min="0"
            max="280"
            :style="{ backgroundSize: `${(radius / 280) * 100}%` }"
            @change="handleRadius"
          />
        </div>
        <div class="t_con">
          <v3-color-picker btn size="medium" :value="mouth.baseColor || ''" @change="changeColor($event, 'mouth')" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { V3ColorPicker } from 'v3-color-picker'
import { computed, onBeforeMount, onUnmounted, reactive, ref, watch } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'

// 文案对应
const colorText = {
  baseColor: '背景色',
  shadowColor: '阴影色',
  stopColor1: '右下侧色',
  stopColor2: '左上侧色',
}

// 眼睛可设置的最大最小值
const eyeMin = computed(() => {
  return function (type: string) {
    let min = 0
    let max = 10
    switch (type) {
      case 'rx':
        min = 10
        max = 200
        break
      case 'ry':
        min = 5
        max = 200
        break
      case 'cx':
        // min 太大，导致样式有些许不准确
        min = 30
        max = 650
        break
      case 'cy':
        min = 30
        max = 650
        break

      default:
        break
    }
    return { min, max }
  }
})

// 进度条比例
const percent = (cur: number, data: { min: number; max: number }) => {
  //  - data.min
  const _cur = data.max
  const val = ((cur / _cur) * 100).toFixed(2)
  return `${Math.floor(+val)}%`
}

const head = ref({
  color: {
    baseColor: 'hsl(205, 69%, 50%)',
    shadowColor: '#0061a5',
    stopColor1: 'hsl(205, 24%, 88%)',
    stopColor2: '#6bbeff',
  },
  r: 350,
  cx: 400,
  cy: 400,
  maxW: 350,
})

// 嘴巴：颜色，类型，宽度，倾斜度，微笑/皱眉，旋转，x,y
const mouth = ref({
  width: 30,
  lightWidth: 15,
  length: 30,
  type: 1, // 'smile -> 1 /frown -> 2'
  baseColor: 'hsl(3, 100%, 51%)',
  shadowColor: '#c20000',
  shadowOpacity: 0.9,
  lightColor: '#ff9667',
  lightColor2: 'hsl(3, 100%, 51%)',
  rotation: 30,
  positionX: 0,
  positionY: 0,
})

// 左右眼: 颜色， 尺寸x,y，位置x,y， 类型
const eye = ref({
  color: {
    baseColor: 'black',
    shadowColor: '#000000',
    stopColor1: '#ff5770',
    stopColor2: 'black',
  },
  shadowOpacity: 0.8,
  left: {
    rx: 18,
    ry: 25,
    cx: 285,
    cy: 375,
  },
  right: {
    rx: 25,
    ry: 35,
    cx: 435,
    cy: 375,
  },
})

const tips = () => {
  alert('开发中...')
}

// 背景圆角
const radius = ref(20)
const handleSize = (e, type: string, nowType, eyeType?) => {
  // console.log('e_handleRadius', e.target.value)

  if (type == 'head') {
    head.value[nowType] = +e.target.value
  } else if (type == 'eye') {
    eye.value[eyeType][nowType] = +e.target.value
  } else if (type == 'mouth') {
  }
}

/**
 * 切换颜色 ->
 * 会伴随randomize方法执行，因为依赖 colorsSetting
 */
const changeColor = (e: string, type: string, colorType) => {
  // output->head rgb(145, 128, 128)
  // output->eye rgb(199, 21, 133)
  // output->mouth hsl(3, 19%, 65%)
  if (type == 'head') {
    head.value.color[colorType] = e
  } else if (type == 'eye') {
    eye.value[colorType] = e
  } else if (type == 'mouth') {
    mouth.value[colorType] = e
  }
  console.log(`output->e`, e)
}

// 随机生成
const randomize = () => {
  console.log(`output->111`, 111)
}

onBeforeMount(() => {
  // randomize()
})

onUnmounted(() => {
  // clipboard.destroy()
})
</script>

<style lang="scss">
@import './index.scss';
</style>
