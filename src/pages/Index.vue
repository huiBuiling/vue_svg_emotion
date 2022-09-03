<template>
  <div class="home">
    <div class="home_line"></div>
    <div class="center">
      <div
        ref="avatarRef"
        class="avatar"
        :style="{
          background: colorsSetting['bg'],
          transform: `rotateY(${isRotate ? '180deg' : '0deg'})`,
          borderRadius: radius + 'px',
        }"
      >
        <div class="avatar-payload" v-html="svgContent"></div>
      </div>

      <!-- opera_group  -->
      <div class="opera_group">
        <div
          v-for="item in actions.slice(0, 4)"
          :key="item.type"
          class="opera_group_i"
          :style="{
            opacity:
              ['prev', 'next'].includes(item.type) &&
              (item.type === 'prev' ? curIndex === 0 : curIndex === endIndex)
                ? 0.3
                : 0.6,
          }"
          @click="item.fun"
        >
          <img :src="item.icon" :alt="item.tip" />
        </div>
      </div>

      <!-- btn_group -->
      <div class="btn_group">
        <button class="btn_i btn_1" @click="randomize">随机生成</button>
        <button
          class="btn_i btn_2"
          :disabled="downloading"
          @click="handleDownload"
        >
          下载头像
        </button>
        <button class="btn_i btn_3" @click="tips">批量生成</button>
      </div>
    </div>

    <!-- 可视化块 -->
    <div class="right">
      <div class="view">
        <div class="t_title">背景色</div>
        <input
          v-model="radius"
          type="range"
          name="points"
          min="0"
          max="280"
          :style="{ backgroundSize: `${(radius / 280) * 100}%` }"
          @change="handleRadius"
        />
        <div class="t_con">
          <!-- 注意写法 @change
          "changeColor($event, 'bg')" 初始就会执行
          改为
          ($event) => changeColor($event, 'bg')
           -->
          <v3-color-picker
            size="medium"
            :value="colorsSetting['bg'] || ''"
            @change="($event) => changeColor($event, 'bg')"
          />
        </div>
      </div>
      <div v-for="item in slideJson" :key="item.type" class="view">
        <div class="t_title">{{ item.name }}</div>
        <div
          v-if="['tops', 'clothes', 'earrings', 'glasses'].includes(item.type)"
          class="t_color"
        >
          <v3-color-picker
            size="medium"
            :value="colorsSetting[item.type] || ''"
            @change="($event) => changeColor($event, item.type)"
          />
        </div>
        <div class="t_con">
          <div
            v-for="(itemC, index) in item.data"
            :key="index"
            class="con_item_con"
            @click="onChange(itemC.widgetType, itemC.widgetShape)"
          >
            <div
              class="con_item"
              :class="{
                active:
                  activeShape && activeShape[item.type] === itemC.widgetShape,
                none: itemC.widgetShape === 'none',
              }"
              v-html="itemC.svgRaw"
            ></div>
            <span>{{ itemC.widgetShape }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 代码块 -->
    <!-- <pre><code class="code-content" v-html="codeData"></code></pre> -->
    <!-- name="fade" -->
    <transition>
      <div v-show="showCode" class="mask">
        <div class="left">
          <div class="left_top">
            <span> 代码块 </span>
            <img
              class="close"
              :src="actions[4].icon"
              :alt="actions[4].tip"
              @click="closeCode"
            />
          </div>

          <div class="code_view">
            <vue-json-pretty
              :deep="1"
              show-length
              show-line-number
              show-icon
              :data="codeData"
            />
          </div>

          <button
            id="copy-code-btn"
            class="copy-btn"
            :disabled="isCopying"
            :data-clipboard-text="JSON.stringify(avatarOption.widgets)"
            @click="copyCode"
          >
            复制代码
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import 'vue-json-pretty/lib/styles.css'

import Clipboard from 'clipboard'
import html2canvas from 'html2canvas'
import { V3ColorPicker } from 'v3-color-picker'
import {
  computed,
  onBeforeMount,
  // onMounted,
  onUnmounted,
  reactive,
  ref,
  watchEffect,
} from 'vue'
import VueJsonPretty from 'vue-json-pretty'

import IconPrev from '@/assets/group/icons/icon-back.svg'
import IconClose from '@/assets/group/icons/icon-close.svg'
import IconCode from '@/assets/group/icons/icon-code.svg'
import IconFlip from '@/assets/group/icons/icon-flip.svg'
import IconNext from '@/assets/group/icons/icon-next.svg'
import { AVATAR_Index } from '@/utils/constant'
import { svgData } from '@/utils/dynamic-data'
import { getRandomAvatarOption, initAvatarData } from '@/utils/initData'
import type { AvatarOldOption, AvatarOption } from '@/utils/shapeBaseTypes'
import { NONE } from '@/utils/shapeBaseTypes'
import { slideJson } from '@/utils/slide'

// import { highlightJSON } from "@/utils/toJson";
// import { iconsStore } from '@/store/icons'
// const store = iconsStore()
// const name = computed(() => store.name)
// const svgContent = computed(() => store.initIcon)
// store.updateName('lee')

const tips = () => {
  alert('开发中...')
}

const actions = computed(() => [
  {
    // type: ActionType.Undo,
    icon: IconPrev,
    type: 'prev',
    tip: '撤回',
    fun: () => handleProgre('prev'),
  },
  {
    icon: IconNext,
    type: 'next',
    tip: '前进',
    fun: () => handleProgre('next'),
  },
  {
    icon: IconFlip,
    type: 'flip',
    tip: '翻转',
    fun: () => handleRotate(),
  },
  {
    icon: IconCode,
    type: 'code',
    tip: '代码',
    fun: () => handleCode(),
  },
  {
    icon: IconClose,
    tip: '关闭',
  },
])

// 初始化头像数据
let avatarOption: AvatarOption = reactive({
  widgets: {},
})

// 用于撤销前进数据
let oldData: AvatarOldOption[] = reactive([])
let curIndex = ref(0)
let endIndex = ref(0)

// 配色对应
let colorsSetting = ref({})

// 渲染avatar
const svgContent = ref('')

// 选中项
const activeShape = ref({})

// 后退，前进
const handleProgre = (type) => {
  if (
    (type === 'prev' && curIndex.value > 0) ||
    (type === 'next' && curIndex.value < oldData.length - 1)
  ) {
    let _curI = -1
    if (type === 'prev' && curIndex.value > 0) {
      _curI = curIndex.value - 1
      curIndex.value = curIndex.value - 1
    } else {
      _curI = curIndex.value + 1
      curIndex.value = curIndex.value + 1
    }

    if (_curI > -1) {
      radius.value = oldData[_curI].bgRdius
      const _cur = {
        ...oldData[_curI],
      }
      changeActShape(_cur.widgets, oldData[_curI].bgColor)
      avatarOption.widgets = _cur.widgets
    }
  }
}

// 前进后退时选中项跟随变化
const changeActShape = (data, bgColor) => {
  let _curActShape = {}
  let _curActColor = {
    bg: bgColor,
  }
  for (const key in data) {
    _curActShape[key] = data[key].shape
    if (colorsSetting.value[key]) {
      _curActColor[key] = data[key].fillColor
    }
  }
  activeShape.value = _curActShape
  colorsSetting.value = _curActColor
}

// 背景圆角
const radius = ref(20)
const handleRadius = (e) => {
  console.log('e', e.target.value)
  radius.value = +e.target.value
  oldData[curIndex.value.toString()].bgRdius = radius.value
}

/**
 * 切换颜色 ->
 * 一进来就执行了，导致很多问题
 * 注意写法
 * "changeColor($event, 'bg')" 初始就会执行
    改为
    ($event) => changeColor($event, 'bg')
 */
const changeColor = (e: string, type: string) => {
  if (type === 'bg') {
    colorsSetting.value[type] = e
    oldData[curIndex.value.toString()].bgColor = e
  } else {
    colorsSetting.value[type] = e
    const _cur = {
      ...avatarOption.widgets,
      [type]: {
        ...avatarOption.widgets[type],
        fillColor: e,
      },
    }
    avatarOption.widgets = _cur
    // 不转换会导致数据前后不一致问题
    oldData[curIndex.value.toString()].widgets = JSON.parse(
      JSON.stringify(_cur)
    )
  }
}

// watchEffect(() => {
//   console.log(`output->colorsSetting`, colorsSetting)
// })

// 切换选项
const onChange = (type: string, shape: string) => {
  console.log(`output->onChange`, type, shape)
  const _cur = {
    ...avatarOption.widgets,
    [type]: {
      ...avatarOption.widgets[type],
      shape: shape,
    },
  }
  activeShape.value[type] = shape
  avatarOption.widgets = _cur
  oldData[curIndex.value.toString()].widgets = JSON.parse(JSON.stringify(_cur))
}

// 导入svg数据
const getSvgInitData = () => {
  // 层级处理
  const sortedList = Object.entries(avatarOption.widgets).sort(
    ([prevShape, prev], [nextShape, next]) => {
      const ix = prev.zIndex ?? AVATAR_Index[prevShape]?.zIndex ?? 0
      const iix = next.zIndex ?? AVATAR_Index[nextShape]?.zIndex ?? 0
      return ix - iix
    }
  )

  const cur: Promise<string>[] = sortedList.map(async ([widgetType, opt]) => {
    if (opt.shape !== NONE && svgData?.[widgetType]?.[opt.shape]) {
      const _cur = svgData[widgetType][opt.shape]
      // () => import('/src/assets/widgets/face/base.svg?import&raw')
      return (await _cur()).default
    }
    return ''
  })
  return { cur, sortedList }
}

// 获取渲染svg
const getSvgRawList = async () => {
  // 获取所有svg
  const svgInitData = getSvgInitData()
  const cur = await Promise.all(svgInitData.cur).then((raw) => {
    // console.log('raw', raw)
    const _cur = raw.map((svgRaw, i) => {
      /**
       * sortedList: len = 11, 二维数组
       * widgetFillColor：获取填充色
       * svgRaw：完整svg数据

        * -> 截取掉头部
        * svgRaw.indexOf('>', svgRaw.indexOf('<svg'))：index eg：109
        * - indexOf(searchString, ?position)
        * - svgRaw.indexOf('<svg') => 0
        * - slice(?start, ?end)
        *
        * -> 截取掉尾部
        * .replace('</svg>', '')
        *
        * -> 颜色替换
        * .replaceAll(searchValue, replaceValue)
        * 部分部位svg 存在：fill="$fillColor" -> 替换为 widgetFillColor
        */

      // if(svgInitData?.sortedList[i][1]) {
      //   console.log(`output->glasses`,svgInitData?.sortedList[i][1])
      // }
      const widgetFillColor = svgInitData?.sortedList[i][1].fillColor
      let content = svgRaw
        .slice(svgRaw.indexOf('>', svgRaw.indexOf('<svg')) + 1)
        .replace('</svg>', '')
        .replaceAll('$fillColor', widgetFillColor || '#000000')

      /**
       * 输出每一个部位的svg
       * id=(eg:"vue-color-avatar-eyes"
       */
      return `
        <g id="vue-color-avatar-${svgInitData?.sortedList[i][0]}">
          ${content}
        </g>
      `
    })
    return _cur
  })

  return cur
}

// 依赖追踪
watchEffect(async () => {
  const svgRawList = await getSvgRawList()

  const size = ref(280)
  svgContent.value = `
    <svg
      width="280"
      height="280"
      viewBox="0 0 ${size.value / 0.7} ${size.value / 0.7}"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(100, 65)">
        ${svgRawList.join('')}
      </g>
    </svg>
  `

  // console.log('svgContent', svgContent)
})

// 翻转
const isRotate = ref(false)
const handleRotate = () => {
  isRotate.value = !isRotate.value
}

// 查看code
const showCode = ref(false)
const codeData = ref({})
const handleCode = () => {
  const _cur = JSON.stringify(avatarOption.widgets, null, 4)
  codeData.value = JSON.parse(_cur)
  showCode.value = true
  console.log(`output->avatarOption.widgets`, _cur, codeData.value)
}
const closeCode = () => {
  showCode.value = false
}

// copyCode
let clipboard = new Clipboard('#copy-code-btn')
const isCopying = ref(false)
const copyCode = async () => {
  clipboard.on('success', (e: any) => {
    isCopying.value = true

    setTimeout(() => {
      isCopying.value = false
    }, 800)
    e.clearSelection()
  })
}

const downloading = ref(false)
const avatarRef = ref(null)
// 下载图片
async function handleDownload() {
  try {
    downloading.value = true
    const avatarEle = avatarRef.value

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

// 随机生成
const randomize = (type?) => {
  const { colorsSettingData, data, shape } = getRandomAvatarOption()
  colorsSetting.value = { ...colorsSettingData }
  activeShape.value = shape
  oldData.push({
    bgColor: colorsSetting.value['bg'],
    bgRdius: radius.value,
    widgets: JSON.parse(JSON.stringify(data)),
  })
  avatarOption.widgets = data
  endIndex.value = type == 'init' ? 0 : endIndex.value + 1
  curIndex.value = type == 'init' ? 0 : curIndex.value + 1
  console.log(`output->type`, JSON.parse(JSON.stringify(data)))
}

onBeforeMount(() => {
  randomize('init')
})

onUnmounted(() => {
  clipboard.destroy()
})
</script>

<style lang="scss">
.home {
  // background-color: #14161a;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #a4b2c1;
  // background: linear-gradient( 135deg, #81FFEF 10%, #F067B4 100%);
  // background: radial-gradient(rgba(105, 103, 254, 0.8) 20%, rgba(105, 103, 254, 0.6) 40%, rgba(105, 103, 254, 0.4) 60%, rgba(105, 103, 254, 0.2) 80%, transparent 100%);
  // background: radial-gradient(rgba(105, 103, 254, 0.8) 20%, #81FFEF 40%, rgba(105, 103, 254, 0.4) 60%, #F067B4 80%, transparent 100%);
  // background: radial-gradient(rgba(105, 103, 254, 0.8) 10%, rgb(129, 255, 239, .5) 40%, rgba(105, 103, 254, 0.4) 60%, rgb(240, 103, 180, .4) 80%, transparent 100%);
  .home_line {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      rgba(105, 103, 254, 0.8) 10%,
      rgb(129, 255, 239, 0.5) 40%,
      rgba(105, 103, 254, 0.4) 60%,
      rgb(240, 103, 180, 0.4) 80%,
      transparent 100%
    );
    opacity: 0.7;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0, 0, 0, 0.5);
  }

  .left {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100%;
    padding: 20px;
    background: #2c323a;
    box-shadow: 10px 0 30px rgb(0, 0, 0, 0.5);

    .left_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      text-align: left;
      span {
        font-weight: bold;
        font-size: 20px;
      }
    }
    .close {
      width: 20px;
      height: 20px;
      padding: 5px;
      background: #6a707e;
      border-radius: 50%;
      cursor: pointer;
    }
    .code_view {
      background: #fff;
      border-radius: 5px;
    }

    .copy-btn {
      width: 100px;
      margin-top: 20px;
      padding: 10px;
      font-weight: 600;
      font-size: 14px;
      // background-color: #404854;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      cursor: pointer;
    }
  }

  .center {
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-top: 150px;

    .avatar {
      position: relative;
      width: 280px;
      height: 280px;
      margin: 0 auto;
      overflow: hidden;
      background: #fff;
      border-radius: 5px;
    }

    .view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .avatar-payload {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
    }

    .opera_group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 220px;
      margin: 50px auto;
      padding: 10px;
      // background-color: #2a2f37;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 100px;
    }

    .opera_group_i {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: #404854;
      border-radius: 50%;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .btn_group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 330px;
      margin: 0 auto;
    }

    .btn_i {
      width: 100px;
      padding: 10px;
      font-weight: 600;
      font-size: 14px;
      // background-color: #404854;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      cursor: pointer;
    }
  }

  input[type='range'] {
    width: 100% !important;
    // background-size: 33% 100%; /*设置左右宽度比例*/
    height: 8px;
    margin: 8px 0 20px;
    background: -webkit-linear-gradient(#6967fe, #6967fe) no-repeat, #acabff;
    border-radius: 10px;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none; /*清除系统默认样式*/
  }
  /*拖动块的样式*/
  input[type='range']::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
    background: #f8f9fa;
    border: solid 1px #ddd;
    border-radius: 50%;
    -webkit-appearance: none;
  }

  .right {
    width: 320px;
    min-width: 320px;
    padding: 0 20px 60px;
    overflow-y: auto;
    text-align: left;
    border-left: 3px solid rgba(255, 255, 255, 0.6);

    &::-webkit-scrollbar {
      width: 4px;
      height: 6px;
    }
    // 滚动区域背景
    &::-webkit-scrollbar-track-piece {
      background-color: rgb(17, 16, 16);
      background-color: white;
      -webkit-border-radius: 6px;
    }

    // 竖向滚动条
    &::-webkit-scrollbar-thumb:vertical {
      height: 5px;
      background-color: rgb(70, 68, 68);
      background-color: #aaaaaa;
      -webkit-border-radius: 6px;
    }

    .t_title {
      margin: 40px 0 20px;
      // color: #fff;
      color: #1e1d1d;
      font-weight: 600;
      font-size: 16px;
      line-height: 23px;
    }

    .t_con {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    .con_item_con {
      position: relative;
      width: 80px;
      height: 120px;
      margin: 10px;
      color: #818699;
      font-size: 14px;
      text-align: center;
    }
    .con_item {
      position: relative;
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.6);
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      cursor: pointer;
    }

    .active,
    .con_item:hover {
      border: 2px solid #6967fe;
    }

    svg {
      width: 80%;
      height: 80%;
      margin: 10%;
    }

    .none {
      font-weight: normal;
      font-size: 30px;
      line-height: 80px;
      text-align: center;
    }
  }
}

/* 设置持续时间和动画函数
没有设置name，就是v-xx, 设置后就是 [name]-xx
*/
.v-enter-active,
.v-leave-active {
  transition: opacity 0.7s ease;
}

.v-enter-from {
  transform: translateX(-300px);
  opacity: 0;
}

.v-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.v-leave-to {
  opacity: 0;
}

.t_color {
  position: relative;
}
</style>
