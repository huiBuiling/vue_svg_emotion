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
              ['prev', 'next'].includes(item.type) && (item.type === 'prev' ? curIndex === 0 : curIndex === endIndex)
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
        <button class="btn_i btn_2" :disabled="downloading" @click="handleDownload">下载头像</button>
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

          !!!注意：watchEffect导致的，非上述问题
           -->
          <v3-color-picker btn size="medium" :value="colorsSetting['bg'] || ''" @change="changeColor($event, 'bg')" />
        </div>
      </div>
      <div v-for="item in slideJson" :key="item.type" class="view">
        <div class="t_title">{{ item.name }}</div>
        <div v-if="['tops', 'clothes', 'earrings', 'glasses'].includes(item.type)" class="t_color">
          <v3-color-picker
            btn
            size="medium"
            :value="colorsSetting[item.type] || ''"
            @change="changeColor($event, item.type)"
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
                active: activeShape && activeShape[item.type] === itemC.widgetShape,
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
            <img class="close" :src="actions[4].icon" :alt="actions[4].tip" @click="closeCode" />
          </div>

          <div class="code_view">
            <vue-json-pretty :deep="1" show-length show-line-number show-icon :data="codeData" />
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
  watch,
  watchEffect,
} from 'vue'
import VueJsonPretty from 'vue-json-pretty'

import IconPrev from '@/assets/group/icons/icon-back.svg'
import IconClose from '@/assets/group/icons/icon-close.svg'
import IconCode from '@/assets/group/icons/icon-code.svg'
import IconFlip from '@/assets/group/icons/icon-flip.svg'
import IconNext from '@/assets/group/icons/icon-next.svg'
// import { highlightJSON } from "@/utils/toJson";
import { widgetStore } from '@/store/icons'
import { AVATAR_Index } from '@/utils/constant'
import { svgData } from '@/utils/dynamic-data'
import { getRandomAvatarOption } from '@/utils/initData'
import type { AvatarOldOption, AvatarOption } from '@/utils/shapeBaseTypes'
import { NONE } from '@/utils/shapeBaseTypes'
import { slideJson } from '@/utils/slide'

const store = widgetStore()
console.log(`output->stroe`, store)
// const name = computed(() => store.name)
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
    type: 'close',
    tip: '关闭',
  },
])

// 初始化头像数据
let avatarOption: AvatarOption = reactive({
  widgets: store.widgetsData,
})

// 用于撤销前进数据
let oldData: AvatarOldOption[] = reactive(store.widgetsDataArr)
let curIndex = ref(0)
let endIndex = ref(0)

// 配色对应
let colorsSetting = ref({})

// 渲染avatar
const svgContent = ref('')

// 选中项
const activeShape = ref({})

// 处理 randomize就会执行，伴随changeColor方法执行
let isRandomize = ref(true)

// 背景圆角
const radius = ref(20)
const handleRadius = (e) => {
  console.log('e_handleRadius', e.target.value)
  radius.value = +e.target.value
  store.updateWidgetArrBg(curIndex.value, 'bgRdius', radius.value)
}

/**
 * 切换颜色 ->
 * 会伴随randomize方法执行，因为依赖 colorsSetting
 */
const changeColor = (e: string, type: string) => {
  if (colorsSetting.value[type] == e) return

  console.log(`output->changeColor`, type)
  if (type === 'bg') {
    colorsSetting.value[type] = e
    store.updateWidgetArrBg(curIndex.value, 'bgColor', e)
  } else {
    colorsSetting.value[type] = e
    const _cur = {
      ...avatarOption.widgets,
      [type]: {
        ...avatarOption.widgets[type],
        fillColor: e,
      },
    }
    store.updateWidget(_cur)
    store.updateWidgetArr(curIndex.value, type, {
      ...avatarOption.widgets[type],
      fillColor: e,
    })
  }
}

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
  store.updateWidget(_cur)
  store.updateWidgetArr(curIndex.value, type, {
    ...avatarOption.widgets[type],
    shape: shape,
  })
}

// 导入svg数据
const getSvgInitData = () => {
  console.log(`output->getSvgInitData2`)
  // 层级处理
  const sortedList = Object.entries(avatarOption.widgets).sort(([prevShape, prev], [nextShape, next]) => {
    const ix = prev.zIndex ?? AVATAR_Index[prevShape]?.zIndex ?? 0
    const iix = next.zIndex ?? AVATAR_Index[nextShape]?.zIndex ?? 0
    return ix - iix
  })

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

  console.log(`output->getSvgRawList3`)
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

// 随机生成
const randomize = (type?) => {
  console.log(`output->randomize_1`)
  const { colorsSettingData, data, shape } = getRandomAvatarOption()

  activeShape.value = shape

  endIndex.value = type == 'init' ? 0 : endIndex.value + 1
  curIndex.value = type == 'init' ? 0 : curIndex.value + 1
  store.updateWidget(data)
  store.addWidgetArr({
    bgColor: colorsSettingData['bg'],
    bgRdius: radius.value,
    widgets: JSON.parse(JSON.stringify(data)),
  })
  isRandomize.value = false
  colorsSetting.value = { ...colorsSettingData }
}

// 依赖追踪
const size = 280
watch(
  [avatarOption],
  async ([newAvatarOption]) => {
    console.log('watch', avatarOption, '--------new:', newAvatarOption)

    const svgRawList = await getSvgRawList()
    svgContent.value = `
    <svg
      width="280"
      height="280"
      viewBox="0 0 ${size / 0.7} ${size / 0.7}"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(100, 65)">
        ${svgRawList.join('')}
      </g>
    </svg>
  `
  }
  // { immediate: true }
)

// 前进后退时选中项跟随变化
const changeActShape = (data, bgColor) => {
  console.log(`output->changeActShape`)
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

// 后退，前进
const handleProgre = (type) => {
  console.log(`output->handleProgre`)
  if ((type === 'prev' && curIndex.value > 0) || (type === 'next' && curIndex.value < oldData.length - 1)) {
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
      store.updateWidget(_cur.widgets)
    }
  }
}

// 翻转
const isRotate = ref(false)
const handleRotate = () => {
  console.log(`output->handleRotate`)
  isRotate.value = !isRotate.value
}

// 查看code
const showCode = ref(false)
const codeData = ref({})
const handleCode = () => {
  console.log(`output->handleCode`)
  const _cur = JSON.stringify(avatarOption.widgets, null, 4)
  codeData.value = JSON.parse(_cur)
  showCode.value = true
  console.log(`output->avatarOption.widgets`, _cur, codeData.value)
}
const closeCode = () => {
  console.log(`output->closeCode`)
  showCode.value = false
}

// copyCode
let clipboard = new Clipboard('#copy-code-btn')
const isCopying = ref(false)
const copyCode = async () => {
  console.log(`output->copyCode`)
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
  console.log(`output->handleDownload`)
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

onBeforeMount(() => {
  randomize('init')
})

onUnmounted(() => {
  clipboard.destroy()
})
</script>

<style lang="scss">
@import './index.scss';
</style>
