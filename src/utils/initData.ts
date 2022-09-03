import type { AvatarSettings, AvatarWidgets } from './shapeBaseTypes'
import {
  BeardShape,
  ClothesShape,
  EarringsShape,
  EarShape,
  EyebrowsShape,
  EyesShape,
  FaceShape,
  GlassesShape,
  MouthShape,
  NoseShape,
  TopsShape,
} from './shapeEnum'

export let initAvatarData: AvatarWidgets = {
  face: {
    shape: 'base',
  },
  eyes: {
    shape: 'eyeshadow',
  },
  nose: {
    shape: 'curve',
  },
  tops: {
    shape: 'wave',
    fillColor: '#FC909F',
  },
  ear: {
    shape: 'detached',
  },
  earrings: {
    shape: 'hoop',
  },
  eyebrows: {
    shape: 'eyelashesdown',
  },
  glasses: {
    shape: 'none',
  },
  mouth: {
    shape: 'nervous',
  },
  beard: {
    shape: 'none',
  },
  clothes: {
    shape: 'collared',
    fillColor: '#F48150',
  },
}

export const SETTINGS: Readonly<AvatarSettings> = {
  face: Object.values(FaceShape),
  tops: Object.values(TopsShape),
  ear: Object.values(EarShape),
  earrings: Object.values(EarringsShape),
  eyebrows: Object.values(EyebrowsShape),
  eyes: Object.values(EyesShape),
  nose: Object.values(NoseShape),
  glasses: Object.values(GlassesShape),
  mouth: Object.values(MouthShape),
  beard: Object.values(BeardShape),
  clothes: Object.values(ClothesShape),
}

const commonColors = [
  '#6BD9E9',
  '#FC909F',
  // '#F4D150',
  // '#E0DDFF',
  // '#D2EFF3',
  '#FFEBA4',
  '#506AF4',
  '#F48150',
  '#48A99A',
  '#C09FFF',
  '#FD6F5D',
  '#2C4331',
  '#2D2F24',
  '#805F26',
  '#DCAA9A',
  '#BB9895',
  // '#E9E7F6',
  '#8B9CC5',
  '#7388A3',
  // '#D9E59A',
]

export const colorsSettingData = {
  bg: '#FFEBA4',
  tops: '#FC909F',
  clothes: '#F48150',
  glasses: '#000',
  earrings: '#F4D150',
}

export const _activeShape = {
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
}

/**
 * 先获取所有属性
 * 对应每个属性随机数
 * 对应部分属性随机颜色
 */
export const getRandomAvatarOption = () => {
  // console.log(`output->SETTINGS`, SETTINGS.topsShape)
  const _bgColorIndex = Math.floor(
    Math.random() * Object.keys(commonColors).length
  )
  colorsSettingData.bg = commonColors[_bgColorIndex]

  for (const key in SETTINGS) {
    if (key === 'beard') {
      continue
    }
    // 选项中随机选一个
    const _curIndex = Math.floor(Math.random() * SETTINGS[key].length)
    let _curColorIndex = Math.floor(
      Math.random() * Object.keys(commonColors).length
    )
    _curColorIndex =
      _bgColorIndex == _curColorIndex ? _curColorIndex + 1 : _curColorIndex

    // 设置到对象中
    setShapeValue(key, SETTINGS[key][_curIndex], commonColors[_curColorIndex])
  }

  return {
    data: initAvatarData,
    colorsSettingData,
    shape: _activeShape,
  }
}

export const setShapeValue = (type, shape, color?) => {
  const _cur = initAvatarData
  _cur[type].shape = shape
  _activeShape[type] = shape

  // console.log(`output->SETTINGS[key]`, type, shape)

  if (Object.keys(colorsSettingData).includes(type)) {
    colorsSettingData[type] = color || '#000'
    _cur[type].fillColor = color || '#000'

    // console.log(`output->SETTINGS[key]`, type, shape, _cur[type].fillColor)
  }
  initAvatarData = { ..._cur }
  // console.log(`output->type`, type, shape, color, initAvatarData)
}
