<!-- eslint-disable import/no-unresolved -->
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
        }"
      >
        <div class="avatar-payload" v-html="svgContent"></div>
      </div>

      <!-- opera_group  -->
      <div class="opera_group">
        <div class="opera_group_i prev">
          <img :src="actions[0].icon" :alt="actions[0].tip" />
        </div>
        <div class="opera_group_i next">
          <img :src="actions[1].icon" :alt="actions[1].tip" />
        </div>
        <div class="opera_group_i" @click="handleRotate">
          <img :src="actions[2].icon" :alt="actions[2].tip" />
        </div>
        <div class="opera_group_i" @click="handleCode">
          <img :src="actions[3].icon" :alt="actions[3].tip" />
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
        <button class="btn_i btn_3">批量生成</button>
      </div>
    </div>

    <!-- 可视化块 -->
    <div class="right">
      <div class="view">
        <div class="t_title">背景色</div>
        <div class="t_con">
          <v3-color-picker
            size="medium"
            :value="colorsSetting['bg'] || ''"
            @change="changeColor($event, 'bg')"
          />
        </div>
      </div>
      <div v-for="item in slideJson" :key="item.type" class="view">
        <div class="t_title">{{ item.name }}</div>
        <!-- 'nose' -->
        <div
          v-if="['tops', 'clothes', 'earrings', 'glasses'].includes(item.type)"
          class="t_color"
        >
          <!-- <color-picker
            :show-opacity="false"
            :default-color="item.type === 'tops' ? hairColor : clothesColor"
            :value="item.type === 'tops' ? hairColor : clothesColor"
            @change="changeColor($event, item.type)"
          /> -->
          <!-- :value="colors(item.type) || ''" -->
          <v3-color-picker
            size="medium"
            :value="colorsSetting[item.type] || ''"
            @change="changeColor($event, item.type)"
          />
        </div>
        <div class="t_con">
          <div
            v-for="(itemC, index) in item.data"
            :key="index"
            class="con_item"
            :class="{
              active: activeShape[item.type] === itemC.widgetShape,
              none: itemC.widgetShape === 'none',
            }"
            @click="onChange(itemC.widgetType, itemC.widgetShape)"
            v-html="itemC.svgRaw"
          ></div>
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
import { computed, onUnmounted, reactive, ref, watchEffect } from 'vue'
import VueJsonPretty from 'vue-json-pretty'

import IconPrev from '@/assets/group/icons/icon-back.svg'
import IconClose from '@/assets/group/icons/icon-close.svg'
import IconCode from '@/assets/group/icons/icon-code.svg'
import IconFlip from '@/assets/group/icons/icon-flip.svg'
import IconNext from '@/assets/group/icons/icon-next.svg'
import { AVATAR_Index } from '@/utils/constant'
import { svgData } from '@/utils/dynamic-data'
import { initAvatarData } from '@/utils/initData'
import type { AvatarOption } from '@/utils/shapeBaseTypes'
import { NONE } from '@/utils/shapeBaseTypes'
import { slideJson } from '@/utils/slide'

// import { highlightJSON } from "@/utils/toJson";
// import { iconsStore } from '@/store/icons'
// const store = iconsStore()
// const name = computed(() => store.name)
// const svgContent = computed(() => store.initIcon)
// store.updateName('lee')

const actions = computed(() => [
  {
    // type: ActionType.Undo,
    icon: IconPrev,
    tip: '撤回',
    // disabled: !canUndo.value,
  },
  {
    // type: ActionType.Redo,
    icon: IconNext,
    tip: '前进',
    // disabled: !canRedo.value,
  },
  {
    icon: IconFlip,
    tip: '翻转',
  },
  {
    icon: IconCode,
    tip: '代码',
  },
  {
    icon: IconClose,
    tip: '关闭',
  },
])

// 初始化头像数据
const avatarOption: AvatarOption = reactive({
  widgets: initAvatarData,
})

// 配色对应
let colorsSetting = ref({
  bg: '#FFEBA4',
  tops: '#FC909F',
  clothes: '#F48150',
  glasses: '#000',
  earrings: '#F4D150',
})

// 渲染avatar
const svgContent = ref('')

// 选中项
const activeShape = ref({
  face: 'base',
  tops: 'wave',
  ear: 'detached',
  earrings: 'hoop',
  eyebrow: 'eyelashesdown',
  eyes: 'eyeshadow',
  nose: 'curve',
  glasses: 'none',
  mouth: 'nervous',
  beard: 'none',
  clothes: 'collared',
})

// 切换颜色
const changeColor = (e: string, type: string) => {
  if (type === 'bg') {
    colorsSetting.value[type] = e
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
    // console.log(`output->avatarOption`, avatarOption)
  }
}

watchEffect(() => {
  console.log(`output->colorsSetting`, colorsSetting)
})

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
  console.log(`output->avatarOption`, avatarOption)
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
    // <g transform="translate(0, 0)"> 导致显示位置错乱
    // raw.len = 11: ['<svg\n  width="200"\n  height="320"\n  viewBox="0 0 2…"white"\n      />\n    </clipPath>\n  </defs>\n</svg>', '<svg\n  width="96"\n  height="49"\n  viewBox="0 0 96 …20.4021)"\n      fill="black"\n    />\n  </g>\n</svg>', '<svg\n  width="32"\n  height="40"\n  viewBox="0 0 32 …1921"\n      stroke-width="4"\n    />\n  </g>\n</svg>', '<svg\n  width="149"\n  height="51"\n  viewBox="0 0 14…      stroke-linecap="round"\n    />\n  </g>\n</svg>', '<svg\n  width="240"\n  height="212"\n  viewBox="0 0 2…lack"\n      stroke-width="4"\n    />\n  </g>\n</svg>', '', '<svg\n  width="64"\n  height="64"\n  viewBox="0 0 64 …lack"\n      stroke-width="4"\n    />\n  </g>\n</svg>', '<svg\n  width="48"\n  height="52"\n  viewBox="0 0 48 …#000"\n      stroke-width="4"\n    />\n  </g>\n</svg>', '', '', '<svg\n  width="281"\n  height="93"\n  viewBox="0 0 28…    stroke-linejoin="round"\n    />\n  </g>\n</svg>\n']
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
  console.log(`output->watchEffect`, avatarOption.widgets)
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
  // console.log(`output->svgContent`,JSON.stringify(svgContent.value))
  // const _cur = JSON.stringify(avatarOption.widgets, null, 4)
  // codeData.value = highlightJSON(_cur)
  // console.log(`output->avatarOption.widgets`, _cur, codeData.value )

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
const randomize = () => {
  console.log(`output->activeShape`, activeShape)
}

onUnmounted(() => {
  clipboard.destroy()
})
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #a4b2c1;
  // background-color: #14161a;
  display: flex;
  // background: linear-gradient( 135deg, #81FFEF 10%, #F067B4 100%);
  // background: radial-gradient(rgba(105, 103, 254, 0.8) 20%, rgba(105, 103, 254, 0.6) 40%, rgba(105, 103, 254, 0.4) 60%, rgba(105, 103, 254, 0.2) 80%, transparent 100%);
  // background: radial-gradient(rgba(105, 103, 254, 0.8) 20%, #81FFEF 40%, rgba(105, 103, 254, 0.4) 60%, #F067B4 80%, transparent 100%);
  // background: radial-gradient(rgba(105, 103, 254, 0.8) 10%, rgb(129, 255, 239, .5) 40%, rgba(105, 103, 254, 0.4) 60%, rgb(240, 103, 180, .4) 80%, transparent 100%);
  .home_line {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      rgba(105, 103, 254, 0.8) 10%,
      rgb(129, 255, 239, 0.5) 40%,
      rgba(105, 103, 254, 0.4) 60%,
      rgb(240, 103, 180, 0.4) 80%,
      transparent 100%
    );
    z-index: -1;
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
    width: 300px;
    height: 100%;
    background: #2c323a;
    padding: 20px;
    position: fixed;
    top: 0;
    left: 0;
    box-shadow: 10px 0 30px rgb(0, 0, 0, 0.5);

    .left_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
      margin-bottom: 20px;
      span {
        font-size: 20px;
        font-weight: bold;
      }
    }
    .close {
      background: #6a707e;
      border-radius: 50%;
      padding: 5px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .code_view {
      background: #fff;
      border-radius: 5px;
    }

    .copy-btn {
      width: 100px;
      // background-color: #404854;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      padding: 10px;
      margin-top: 20px;
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
      background: #fff;
      border-radius: 5px;
      margin: 0 auto;
      overflow: hidden;
    }

    .view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .face {
    }
    .tops {
      top: -60px;
      left: -28px;
    }

    .avatar-payload {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
    }

    // svg{
    //   width: 80%;
    //   height: 80%;
    //   margin: 10%;
    // }

    .opera_group {
      width: 220px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      // background-color: #2a2f37;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 100px;
      margin: 50px auto;
    }

    .opera_group_i {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: #404854;
      border-radius: 50%;
      transition: opacity 0.2s;
      opacity: 0.6;
      cursor: pointer;
    }

    .btn_group {
      width: 330px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
    }

    .btn_i {
      width: 100px;
      padding: 10px;
      // background-color: #404854;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }
  }

  .right {
    width: 326px;
    border-left: 3px solid rgba(255, 255, 255, 0.6);
    padding: 0 20px 60px;
    text-align: left;
    overflow-y: auto;

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
      font-size: 16px;
      font-weight: 600;
      line-height: 23px;
      margin: 40px 0 20px;
      // color: #fff;
      color: #1e1d1d;
    }

    .t_con {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    .con_item {
      width: 80px;
      height: 80px;
      // background-color: #2c323a;
      // border: 1px solid #2c323a;
      // background-color: #2b2c2e26;
      // border: 2px solid #2b2c2e26;
      background: rgba(255, 255, 255, 0.6);
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      margin: 10px;
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
      font-size: 30px;
      line-height: 80px;
      text-align: center;
      font-weight: normal;
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
  opacity: 0;
  transform: translateX(-300px);
}

.v-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.v-leave-to {
  opacity: 0;
}

.t_color {
  position: relative;
}
</style>
