<template>
  <div class="home">
    <div class="home_line"></div>
    <div class="center">
      <div class="icon_con">
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
          @change="changeCustomHead(item.id)"
        >
          <input :id="item.id" v-model="isCustomHead" :value="item.id" name="customHead" type="radio" />
          <label :for="item.id" :data-text="item.name"></label>
          <div class="radio__icon"></div>
        </div>
        <!-- 样式 -->
        <br />
        <div
          v-for="item in [
            { name: '样式1', id: 'Head01' },
            { name: '样式2', id: 'Head02' },
            { name: '样式3', id: 'Head03' },
            { name: '样式4', id: 'Head06' },
          ]"
          :key="item.id"
          class="radio checked"
          @change="changeHead(item.id)"
        >
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
          @change="changeCustomEye(item.id)"
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
import { V3ColorPicker } from 'v3-color-picker'
import { computed, onBeforeMount, onUnmounted, reactive, ref, watch } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'
import { getLightenDarkenColor } from '@/utils/index'

// 预选颜色列表
const colors = [
  'hsl(44, 100%, 80%)',
  'hsl(50, 65%, 76%)',
  'hsl(24, 82%, 75%)',
  'hsl(41, 100%, 67%)',
  'hsl(50, 98%, 50%)',
  'hsl(30, 100%, 40%)',
  'hsl(70, 69%, 50%)',

  'hsl(158, 49%, 67%)',

  'hsl(215, 38%, 57%)',
  'hsl(205, 69%, 50%)',
  'hsl(230, 53%, 57%)',
  'hsl(354, 86%, 57%)',
  'hsl(10, 75%, 40%)',
  'hsl(305, 77%, 40%)',
  'hsl(335, 77%, 50%)',
  'hsl(341, 100%, 85%)',

  'hsl(115, 100%, 84%)',
  'hsl(166, 100%, 73%)',
  'hsl(205, 100%, 80%)',
  'hsl(265, 100%, 81%)',
  'hsl(351, 100%, 67%)',
]

// 文案对应
const typeText = {
  baseColor: '背景色',
  shadowColor: '阴影色',
  stopColor1: '右下侧色',
  stopColor2: '左上侧色',
  lightColor: '灯光色1',
  lightColor2: '灯光色2',
  rx: '尺寸 X',
  ry: '尺寸 Y',
  cx: '位置 X',
  cy: '位置 Y',
  size: '大小',
  width: '嘴厚',
  lightWidth: '光宽',
}

// 眼睛可设置的最大最小值
const minAndMax = computed(() => {
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
      case 'm_size':
        // min = 50
        // max = 400
        min = 0
        max = 200
        break
      case 'm_width':
        min = 0
        max = 50
        break
      // case 'm_light':
      //   min = 30
      //   max = 400
      //   break

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

const tips = () => {
  alert('开发中...')
}

const isCustomHead = ref('no')
const changeCustomHead = (e) => {
  if (e == 'no') {
    // alert('已配置色不会更改且关闭自定义配色选项')
    const _curBaseColor = head.value.color.baseColor
    head.value.color = {
      baseColor: _curBaseColor,
      stopColor1: getLightenDarkenColor(_curBaseColor, -54),
      stopColor2: getLightenDarkenColor(_curBaseColor, +50),
    }
  }
  console.log(`output->changeCustomHead`, e)
  isCustomHead.value = e
}

const activeHeadSty = ref('Head01')
const changeHead = (e) => {
  activeHeadSty.value = e
}

const head = ref({
  // 切换头部样式，其他颜色跟随基础色
  color: {
    baseColor: '#FDC855', // FFB3CB
    // shadowColor: '#FA0941',
    stopColor1: getLightenDarkenColor('#FDC855', -54),
    stopColor2: getLightenDarkenColor('#FDC855', +50),
    // stopColor1: '#ECAC1F', // 'E45392'
    // stopColor2: '#EBE8E8', // '#EB6367', 'EBE8E8'
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

const isCustomEye = ref('eye_no')
const changeCustomEye = (e) => {
  if (e == 'eye_no') {
    // alert('已配置色不会更改且关闭自定义配色选项')
    const _curBaseColor = eye.value.color.baseColor
    eye.value.color = {
      baseColor: _curBaseColor,
      stopColor1: getLightenDarkenColor(_curBaseColor, -54),
      stopColor2: getLightenDarkenColor(_curBaseColor, +50),
    }
  }
  console.log(`output->changeCustomEye`, e)
  isCustomEye.value = e
}

// 左右眼: 颜色， 尺寸x,y，位置x,y， 类型
const eye = ref({
  color: {
    baseColor: '#000000', //'rgb(252, 246, 242)', 'rgba(105,103,254, 0.5)'
    // shadowColor: '#000000',
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

// 切换左右眼
const activeEye = ref('left')
const changeEye = (e) => {
  console.log(`output->e`, e, eye[e])
  activeEye.value = e
}

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
 * 会伴随randomize方法执行，因为依赖 colorsSetting
 */
const changeColor = (e: string, type: string, colorType) => {
  if (type == 'head') {
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
    if (isCustomHead.value == 'eye_no') {
      eye.value.color = {
        baseColor: e,
        stopColor1: '#555555',
        stopColor2: '#000000',
      }
    } else {
      eye.value.color[colorType] = e
    }
  } else if (type == 'mouth') {
    mouth.value.color[colorType] = e
  }
  console.log(`output->e`, type, colorType, e)
}

// 随机生成
const randomize = () => {
  console.log(`output->111`, 111)
}

onBeforeMount(() => {
  // randomize()
  const e = {
    target: {
      value: mouth.value.size,
    },
  }
  handleSize(e, 'mouth', 'size')
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
