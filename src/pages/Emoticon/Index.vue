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

        <div class="t_color_con">
          <div v-for="item in Object.keys(head.color)" :key="item" class="t_color">
            <!-- 默认是哪种类型颜色就会输出对应类型颜色 -->
            <v3-color-picker
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
        <!-- 颜色 -->
        <div class="t_color_con">
          <div v-for="item in Object.keys(eye.color)" :key="item" class="t_color">
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

const head = ref({
  color: {
    baseColor: '#FDC855',
    shadowColor: '#FA0941',
    stopColor1: '#E45392',
    stopColor2: '#EB6367',
  },
  r: 350,
  cx: 400,
  cy: 400,
  maxW: 350,
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
    // baseColor: 'rgb(230, 206, 206)',
    // baseColor: 'hsla(241, 44%, 95%, 0.7)', //'rgb(252, 246, 242)', 'rgba(105,103,254, 0.5)'
    // shadowColor: '#E71C81',
    // stopColor1: '#CCCACB',
    // stopColor2: 'rgb(230, 31, 31)',
    baseColor: 'rgba(0,0,0,.5)', //'rgb(252, 246, 242)', 'rgba(105,103,254, 0.5)'
    shadowColor: '#000000',
    stopColor1: '#000000',
    stopColor2: '#000000',
  },
  shadowOpacity: 0.8, // ?
  left: {
    rx: 59,
    ry: 59,
    cx: 303,
    cy: 333,
  },
  right: {
    rx: 59,
    ry: 59,
    cx: 521,
    cy: 333,
  },
})

const tips = () => {
  alert('开发中...')
}

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
    if (nowType == 'size') {
      let _cur = +e.target.value
      if (mouth.value.size > +e.target.value) {
        _cur -= mouth.value.size
        mouth.value.path.s += -_cur
        mouth.value.path.c += -_cur - 35
        mouth.value.path.e -= -_cur
        // console.log(`output->缩小`, '缩小', _cur, mouth.value.path)
      } else {
        _cur -= mouth.value.size
        mouth.value.path.s -= _cur
        mouth.value.path.c -= _cur - 35
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
    head.value.color[colorType] = e
  } else if (type == 'eye') {
    eye.value.color[colorType] = e
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
