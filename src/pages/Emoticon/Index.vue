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

      <div class="radio_view">
        <div class="t_title"><span>选择一种随机生成方案</span></div>
        <div
          v-for="item in [
            { name: '方案1(一切都随机，可能会很抽象！！！)', id: 'random01' },
            { name: '方案2(选用固定的个人觉得很可爱的组合)', id: 'random02' },
          ]"
          :key="item.id"
          class="radio checked"
          @change="changeRandom(item.id)"
        >
          <input :id="item.id" v-model="activeRandom" :value="item.id" name="radio_random" type="radio" />
          <label :for="item.id" :data-text="item.name"></label>
          <div class="radio__icon"></div>
        </div>
      </div>

      <div class="svg_list_t"><span>点击其中一项就可以预览哦~~~</span></div>
      <div class="svg_list">
        <!-- ../../assets/preview/${item}.svg -->
        <img
          v-for="(item, index) in svgDatas"
          :key="item"
          :src="getImageUrl(item)"
          alt=""
          @click="previewSvg(index + 1)"
        />
      </div>
    </div>

    <!-- 可视化块 -->
    <div class="right">
      <!-- head -->
      <div class="view">
        <div class="t_title t_title2"><span>头部</span></div>
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
        <div class="t_title t_title2"><span>眼睛</span></div>
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
          <!-- v-model="eye[activeEye][item]" -->
          <input
            :value="eye[activeEye][item]"
            type="range"
            :name="item"
            :min="minAndMax(item).min"
            :max="minAndMax(item).max"
            :style="{ backgroundSize: percent(item) }"
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
        <div class="t_title t_title2"><span>嘴巴</span></div>
        <!-- 大小尺寸 -->
        <div
          v-for="item in [
            { name: 'size', num: mouth.size },
            { name: 'width', num: mouth.width },
            { name: 'rotation', num: mouth.rotation },
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
import { colors, getLightenDarkenColor, init_eye, minAndMax, styles, typeText } from '@/utils/index'
import { radomDatas } from '@/utils/radomDatas'

const svgDatas = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
]

const tips = () => {
  alert('开发中...')
}

// svg 引入
const getImageUrl = (name: string) => {
  return new URL(`../../assets/preview/${name}.svg`, import.meta.url).href
}

// 进度条比例
const percent = (item: string) => {
  const cur = eye.value[activeEye.value][item]
  const _cur = minAndMax(item).max
  const val = ((cur / _cur) * 100).toFixed(2)
  console.log(`output->percent`, item, cur, _cur, val)
  return `${Math.floor(+val)}%`
}

const isCustomHead = ref('no')
const isCustomEye = ref('eye_no')
const changeCustom = (e, type, color?) => {
  if (type == 'head') {
    isCustomHead.value = e
    e == 'no' && changeColor(color || head.value.color.baseColor, 'head')
  } else {
    isCustomEye.value = e
    e == 'eye_no' && changeColor('#000000', 'eye')
  }
}

// 切换随机方案
const activeRandom = ref('random02')
const changeRandom = (e) => {
  activeRandom.value = e
}

// 切换头部样式
const activeHeadSty = ref('Head01')
const changeHead = (e) => {
  activeHeadSty.value = e
}

// 切换左右眼
let activeEye = ref('left')
const changeEye = (e) => {
  console.log(`output->e`, e, eye[e])
  activeEye.value = e
}

let head = ref({
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

let mouth = ref({
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
  length: 30,
  lightWidth: 6.666666666666667,
  rotation: 0,
  // type: 1, // 'smile -> 1 /frown -> 2'
  // positionX: 0,
  // positionY: 0,
})

// 左右眼: 颜色， 尺寸x,y，位置x,y， 类型
let eye = ref(init_eye)

// 切换大小
const handleSize = (e, type: string, nowType) => {
  console.log(`output->handleSize`, type, +e.target.value)
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
  if (activeRandom.value === 'random01') {
    randomPlan1()
  } else {
    randomPlan2()
  }
}

// 目前随机方案采用款
const randomPlan2 = (_index?: number) => {
  console.log(`output->_index`, _index)
  let _headColorIndex = 0
  let _headStyIndex = 0

  const plan = 20
  _index = _index ? _index : Math.floor(Math.random() * plan)
  const { _mouth, _eye } = radomDatas[_index - 1]
  // 其他部位也变化
  switch (_index) {
    case 1:
      _headColorIndex = 6
      _headStyIndex = 1
      break
    case 2:
      _headColorIndex = 2
      _headStyIndex = 1
      break
    case 3:
      _headColorIndex = 11
      _headStyIndex = 0
      break
    case 4:
      _headColorIndex = 4
      _headStyIndex = 0
      break
    case 55:
      _headColorIndex = 18
      _headStyIndex = 0
      break
    case 5:
      _headColorIndex = 18
      _headStyIndex = 0
      break
    case 6:
      _headColorIndex = 12
      _headStyIndex = 0
      break
    case 7:
      _headColorIndex = 6
      _headStyIndex = 1
      break
    case 8:
      _headColorIndex = 20
      _headStyIndex = 1
      break
    case 9:
      _headColorIndex = 3
      _headStyIndex = 3
      break
    case 10:
      _headColorIndex = 9
      _headStyIndex = 1
      break
    case 11:
      _headColorIndex = 19
      _headStyIndex = 3
      break
    case 12:
      _headColorIndex = 10
      _headStyIndex = 0
      break
    case 13:
      _headColorIndex = 6
      _headStyIndex = 2
      break
    case 14:
      _headColorIndex = 6
      _headStyIndex = 0
      break
    case 15:
      _headColorIndex = 17
      _headStyIndex = 0
      break

    case 16:
      _headColorIndex = 15
      _headStyIndex = 0
      break
    case 17:
      _headColorIndex = 12
      _headStyIndex = 1
      break
    case 18:
      _headColorIndex = 2
      _headStyIndex = 0
      break
    case 19:
      _headColorIndex = 15
      _headStyIndex = 3
      break
    case 20:
      _headColorIndex = 6
      _headStyIndex = 2
      break
    case 21:
      _headColorIndex = 3
      _headStyIndex = 2
      break
    default:
      break
  }

  changeCustom('no', 'head', colors[_headColorIndex])
  activeHeadSty.value = styles[_headStyIndex].id

  eye.value = _eye
  mouth.value = _mouth
}

// 随机方案
const randomPlan1 = () => {
  const _headColorIndex = Math.floor(Math.random() * colors.length)
  changeCustom('no', 'head', colors[_headColorIndex])

  const _headStyIndex = Math.floor(Math.random() * styles.length)
  activeHeadSty.value = styles[_headStyIndex].id

  // 眼睛大小
  /**
   * 眼睛大小
   * 1. 一起缩放
   * 2. 左眼缩放+偏移
   * 3. 右眼缩放+偏移
   * 4. 无任何操作
   *
   * 2. 一起偏移
   */
  // 方案几
  const plan = 5
  const _index = Math.floor(Math.random() * plan)
  if (_index === 5) return
  let eyeData = { ...init_eye }
  let _curIndex, _curIndex2
  switch (_index) {
    case 1:
      _curIndex = Math.floor(Math.random() * minAndMax('rx').max)
      console.log(`output->_index1`, _index, _curIndex)
      if (_curIndex % 2 === 0) {
        eyeData.left = {
          ...eyeData.left,
          rx: _curIndex,
          ry: _curIndex,
        }
      } else {
        eyeData.right = {
          ...eyeData.right,
          rx: _curIndex,
          ry: _curIndex,
        }
      }
      break
    // case 2:
    //   // 太随机，后期设置几个备选项
    //   _curIndex = Math.floor(Math.random() * minAndMax('cx').max) + minAndMax('cx').min
    //   console.log(`output->_index2`, _index, _curIndex)
    //   eyeData.left = {
    //     ...eyeData.left,
    //     cx: _curIndex,
    //     cy: _curIndex,
    //   }
    //   eyeData.right = {
    //     ...eyeData.right,
    //     cx: _curIndex,
    //     cy: _curIndex,
    //   }
    //   break
    case 2:
      _curIndex = Math.floor(Math.random() * minAndMax('rx').max)
      _curIndex2 = Math.floor(Math.random() * minAndMax('cx').max) + minAndMax('cx').min
      eyeData.left = {
        rx: _curIndex,
        ry: _curIndex,
        cx: _curIndex2,
        cy: _curIndex2,
      }
      break
    case 3:
      _curIndex = Math.floor(Math.random() * minAndMax('rx').max)
      _curIndex2 = Math.floor(Math.random() * minAndMax('cx').max) + minAndMax('cx').min
      eyeData.right = {
        rx: _curIndex,
        ry: _curIndex,
        cx: _curIndex2,
        cy: _curIndex2,
      }
      break

    default:
      break
  }

  mouth.value.rotation = Math.floor(Math.random() * 360)
  eye.value = { ...eyeData }
}

// 预览svg
const previewSvg = (index: number) => {
  randomPlan2(index)
}

onBeforeMount(() => {
  randomPlan2()

  // eye.value = { ...init_eye }
  // randomize()
  // const e = {
  //   target: {
  //     value: mouth.value.size,
  //   },
  // }
  // handleSize(e, 'mouth', 'size')
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

onMounted(() => {
  setSvgData()
})

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
