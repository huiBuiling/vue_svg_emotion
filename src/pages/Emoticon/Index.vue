<template>
  <div class="home">
    <div class="home_line"></div>
    <div class="center">
      <div ref="emoticonRef" class="icon_con">
        <SvgIcon
          :head="head"
          :mouth="mouth"
          :eye="eye"
          :active-head-sty="activeHeadSty"
          :is-custom-head="isCustomHead"
          :is-custom-eye="isCustomEye"
          @change="tips()"
        />
      </div>

      <!-- btn_group -->
      <div class="btn_group">
        <button class="btn_i btn_1" @click="randomize">随机生成</button>
        <button class="btn_i btn_2" :disabled="downloading" @click="handleDownload">下载头像</button>
        <button id="copy-svg" class="btn_i btn_3" :disabled="isCopying" :data-clipboard-text="svgData" @click="copySvg">
          copy svg
        </button>
      </div>
    </div>

    <!-- 可视化块 -->
    <div class="right">
      <!-- head -->
      <div class="view">
        <div class="t_title">头部</div>
        <div class="t_title">是否开启头部自定义配色</div>
        <div
          v-for="item in [
            { name: '是', id: 'ok' },
            { name: '否', id: 'no' },
          ]"
          :key="item.id"
          class="radio checked"
          @change="changeCustom(item.id, 'eye')"
        >
          <input :id="item.id" v-model="isCustomHead" :value="item.id" name="customHead" type="radio" />
          <label :for="item.id" :data-text="item.name"></label>
          <div class="radio__icon"></div>
        </div>
        <!-- 样式 -->
        <br />
        <div v-for="item in styles" :key="item.id" class="radio checked" @change="changeHead(item.id)">
          <input :id="item.id" v-model="activeHeadSty" :value="item.id" name="radio_style" type="radio" />
          <label :for="item.id" :data-text="item.name"></label>
          <div class="radio__icon"></div>
        </div>
        <!-- 大小 -->
        <div v-if="activeHeadSty == 'Head06'" class="t_input">
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

        <div class="t_color_con">
          <div
            v-for="item in Object.keys(isCustomHead == 'no' ? { baseColor: head.color.baseColor } : head.color)"
            :key="item"
            class="t_color"
          >
            <!-- 默认是哪种类型颜色就会输出对应类型颜色 -->
            <v3-color-picker
              :colors="colors"
              btn
              size="medium"
              :value="head.color[item] || ''"
              @change="changeColor($event, 'head', item)"
            />
            <p>{{ typeText[item] }}</p>
          </div>
        </div>
      </div>

      <!-- eye -->
      <div class="view">
        <div class="t_title">眼睛</div>
        <!-- 左眼，右眼 -->
        <div
          v-for="item in [
            { name: '左眼', id: 'left' },
            { name: '右眼', id: 'right' },
          ]"
          :key="item.id"
          class="radio checked"
          @change="changeEye(item.id)"
        >
          <input :id="item.id" v-model="activeEye" :value="item.id" name="radio" type="radio" />
          <label :for="item.id" :data-text="item.name"></label>
          <div class="radio__icon"></div>
        </div>

        <!-- 大小尺寸 -->
        <div v-for="item in Object.keys(eye[activeEye])" :key="item" class="t_input">
          <span>{{ typeText[item] }}: </span>
          <input
            v-model="eye[activeEye][item]"
            type="range"
            :name="item"
            :min="minAndMax(item).min"
            :max="minAndMax(item).max"
            :style="{ backgroundSize: percent(eye[activeEye][item], minAndMax(item)) }"
            @change="handleSize($event, 'eye', item)"
          />
        </div>

        <div class="t_title">是否开启眼睛自定义配色</div>
        <div
          v-for="item in [
            { name: '是', id: 'eye_ok' },
            { name: '否', id: 'eye_no' },
          ]"
          :key="item.id"
          class="radio checked"
          @change="changeCustom(item.id, 'eye')"
        >
          <!-- id和其他radio组的重复，则改变事件会失效 -->
          <input :id="item.id" v-model="isCustomEye" :value="item.id" name="customEye" type="radio" />
          <label :for="item.id" :data-text="item.name"></label>
          <div class="radio__icon"></div>
        </div>
        <!-- 颜色 -->
        <div class="t_color_con">
          <div
            v-for="item in Object.keys(isCustomEye == 'eye_no' ? { baseColor: eye.color.baseColor } : eye.color)"
            :key="item"
            class="t_color"
          >
            <v3-color-picker
              btn
              size="medium"
              :value="eye.color[item] || ''"
              @change="changeColor($event, 'eye', item)"
            />
            <p>{{ typeText[item] }}</p>
          </div>
        </div>
      </div>

      <!-- mouth -->
      <div class="view">
        <div class="t_title">嘴巴</div>
        <!-- 大小尺寸 -->
        <div
          v-for="item in [
            { name: 'size', num: mouth.size },
            { name: 'width', num: mouth.width },
          ]"
          :key="item.name"
          class="t_input"
        >
          <span>{{ typeText[item.name] }}: {{ item.num }}</span>
          <input
            v-model="item.num"
            type="range"
            :name="item.name"
            :min="minAndMax(`m_${item.name}`).min"
            :max="minAndMax(`m_${item.name}`).max"
            :style="{ backgroundSize: `${(item.num / minAndMax(`m_${item.name}`).max) * 100}%` }"
            @change="handleSize($event, 'mouth', item.name)"
          />
        </div>

        <div class="t_color_con">
          <div v-for="item in Object.keys(mouth.color)" :key="item" class="t_color">
            <v3-color-picker
              btn
              size="medium"
              :value="mouth.color[item] || ''"
              @change="changeColor($event, 'mouth', item)"
            />
            <p>{{ typeText[item] }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Clipboard from 'clipboard'
import html2canvas from 'html2canvas'
import { V3ColorPicker } from 'v3-color-picker'
import { onBeforeMount, onMounted, onUnmounted, onUpdated, ref, watch, watchEffect } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'
import { colors, getLightenDarkenColor, minAndMax, percent, styles, typeText } from '@/utils/index'

const tips = () => {
  alert('开发中...')
}

const isCustomHead = ref('no')
const isCustomEye = ref('eye_no')
const changeCustom = (e, type) => {
  if (type == 'head') {
    isCustomHead.value = e
    e == 'no' && changeColor(head.value.color.baseColor, 'head')
  } else {
    isCustomEye.value = e
    e == 'eye_no' && changeColor('#000000', 'eye')
  }
}

// 切换头部样式
const activeHeadSty = ref('Head01')
const changeHead = (e) => {
  activeHeadSty.value = e
}

// 切换左右眼
const activeEye = ref('left')
const changeEye = (e) => {
  console.log(`output->e`, e, eye[e])
  activeEye.value = e
}

const head = ref({
  // 切换头部样式，其他颜色跟随基础色
  color: {
    baseColor: '#FDC855', // FFB3CB
    stopColor1: getLightenDarkenColor('#FDC855', -54),
    stopColor2: getLightenDarkenColor('#FDC855', +50),
  },
  r: 250,
  cx: 400,
  cy: 400,
  maxW: 250,
})

const mouth = ref({
  path: {
    s: 350,
    c: 400,
    e: 450,
  },
  // d: 'M159 544.5Q234 654.5 459 544.5 ',
  // M297.6388854980469 544.5Q372.6388854980469 654.5 285.6388854980469 544.5
  // M270 544.5Q345 654.5 348 544.5
  color: {
    baseColor: 'hsl(3, 100%, 51%)',
    shadowColor: '#c20000',
    lightColor: '#ff9667',
    lightColor2: 'hsl(3, 100%, 51%)',
  },
  shadowOpacity: 0.9, // ?
  size: 100,
  width: 28,
  lightWidth: 6.666666666666667,
  length: 30,
  type: 1, // 'smile -> 1 /frown -> 2'
  rotation: 30,
  positionX: 0,
  positionY: 0,
})

// 左右眼: 颜色， 尺寸x,y，位置x,y， 类型
const eye = ref({
  color: {
    baseColor: '#000000', //'rgb(252, 246, 242)', 'rgba(105,103,254, 0.5)'
    stopColor1: '#555555',
    stopColor2: '#000000',
  },
  shadowOpacity: 0.3, // 0.2
  left: {
    rx: 39,
    ry: 39,
    cx: 318,
    cy: 357,
  },
  right: {
    rx: 39,
    ry: 39,
    cx: 482,
    cy: 357,
  },
})

// 切换大小
const handleSize = (e, type: string, nowType) => {
  if (type == 'head') {
    head.value[nowType] = +e.target.value
  } else if (type == 'eye') {
    eye.value[activeEye.value][nowType] = +e.target.value
  } else if (type == 'mouth') {
    // 处理嘴巴大小
    if (nowType == 'size') {
      let _cur = +e.target.value
      if (mouth.value.size > +e.target.value) {
        _cur -= mouth.value.size
        mouth.value.path.s += -_cur
        mouth.value.path.c += -_cur
        mouth.value.path.e -= -_cur
        // console.log(`output->缩小`, '缩小', _cur, mouth.value.path)
      } else {
        _cur -= mouth.value.size
        mouth.value.path.s -= _cur
        mouth.value.path.c -= _cur // - 35
        mouth.value.path.e += _cur
        // console.log(`output->变大`, '变大', _cur, mouth.value.path)
      }
      mouth.value.size = +e.target.value
    } else {
      mouth.value[nowType] = +e.target.value
    }
  }
  console.log(`output->进度条`, type, nowType, +e.target.value)
}

/**
 * 切换颜色 ->
 */
const changeColor = (e: string, type: string, colorType?) => {
  if (type == 'head') {
    if (head.value.color.baseColor == e) return

    if (isCustomHead.value == 'no') {
      head.value.color = {
        baseColor: e,
        stopColor1: getLightenDarkenColor(e, -54),
        stopColor2: getLightenDarkenColor(e, +50),
      }
    } else {
      head.value.color[colorType] = e
    }
  } else if (type == 'eye') {
    if (isCustomEye.value == 'eye_no') {
      console.log(`output->eye_no`, e)
      eye.value.color = {
        baseColor: e,
        stopColor1: '#555555',
        stopColor2: e,
      }
    } else {
      eye.value.color[colorType] = e
    }
  } else if (type == 'mouth') {
    mouth.value.color[colorType] = e
  }
}

const downloading = ref(false)
const emoticonRef = ref(null)
// 下载图片
async function handleDownload() {
  console.log(`output->handleDownload`)
  try {
    downloading.value = true
    const avatarEle = emoticonRef.value
    if (avatarEle) {
      const canvas = await html2canvas(avatarEle, {
        backgroundColor: null,
      })
      const dataURL = canvas.toDataURL()
      const trigger = document.createElement('a')
      trigger.href = dataURL
      trigger.download = 'avatar.png'
      trigger.click()
    }
  } finally {
    setTimeout(() => {
      downloading.value = false
    }, 800)
  }
}

const svgData = ref()
let clipboard = new Clipboard('#copy-svg')
const isCopying = ref(false)
const copySvg = async () => {
  clipboard.on('success', (e: any) => {
    isCopying.value = true
    setTimeout(() => {
      isCopying.value = false
    }, 800)
    e.clearSelection()
  })
}

const setSvgData = () => {
  const _cur = document.getElementsByTagName('svg')[0]
  svgData.value = _cur?.outerHTML
}

/**
 * 随机生成
 */
const randomize = () => {
  const _headColorIndex = Math.floor(Math.random() * colors.length)
  changeColor(colors[_headColorIndex], 'head')

  const _headStyIndex = Math.floor(Math.random() * styles.length)
  activeHeadSty.value = styles[_headStyIndex].id

  // 眼睛大小
  /**
   * 眼睛大小
   * 1. 一起缩放
   * 2. 左眼 + 右眼
   * 3. 位置偏移，建议一次一边即可
   */
}

onBeforeMount(() => {
  // randomize()
  // const e = {
  //   target: {
  //     value: mouth.value.size,
  //   },
  // }
  // handleSize(e, 'mouth', 'size')
})

onMounted(() => {
  setSvgData()
})

// watch(
//   [activeHeadSty, head],
//   async () => {
//     setSvgData()
//     console.log('watch', activeHeadSty)
//   },
//   //深度监听
//   { deep: true }
//   { immediate: true }
// )

onUpdated(() => {
  setSvgData()
})

onUnmounted(() => {
  // clipboard.destroy()
})
</script>

<style lang="scss">
@import './index.scss';

.v3-c-p.v3-c-p-medium {
  .c-p-t {
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
  }
  .c-p-c,
  .c-p-c-i {
    border-radius: 50%;
  }
  .c-p-c {
    border: none;
  }
}
</style>
