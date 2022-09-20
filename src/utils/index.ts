// 处理颜色变浅或变深
const getLightenDarkenColor = (col, amt) => {
  let usePound = false

  if (col.includes('hsl')) {
    col = dealHsl(col)
  }

  if (col[0] == '#') {
    col = col.slice(1)
    usePound = true
  }

  const num = parseInt(col, 16)

  let r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  let b = ((num >> 8) & 0x00ff) + amt

  if (b > 255) b = 255
  else if (b < 0) b = 0

  let g = (num & 0x0000ff) + amt

  if (g > 255) g = 255
  else if (g < 0) g = 0

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
}

// 处理hsl格式转rgb
// function hslToRgb(h, s, l) {
//   let r, g, b

//   if (s == 0) {
//     r = g = b = l // achromatic
//   } else {
//     const hue2rgb = function hue2rgb(p, q, t) {
//       if (t < 0) t += 1
//       if (t > 1) t -= 1
//       if (t < 1 / 6) return p + (q - p) * 6 * t
//       if (t < 1 / 2) return q
//       if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
//       return p
//     }

//     const q = l < 0.5 ? l * (1 + s) : l + s - l * s
//     const p = 2 * l - q
//     r = hue2rgb(p, q, h + 1 / 3)
//     g = hue2rgb(p, q, h)
//     b = hue2rgb(p, q, h - 1 / 3)
//   }

//   return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
// }
// const rgb = hsl2rgb(1, 0.6, 0.5)
// const int = rgb[0] * 255 * 255 + rgb[1] * 255 + rgb[2]
// const fillStyle = '#' + int.toString(16)
// console.log('fillStyle', fillStyle)

// 处理hsl格式转rgb
// oneliner version
const hsl2rgb = (
  h,
  s,
  l,
  a = s * Math.min(l, 1 - l),
  f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
) => [f(0), f(8), f(4)]

// r,g,b are in [0-1], result e.g. #0812fa.
// r: number, g: number, b: number
const rgb2hex = (r: number, g: number, b: number) =>
  '#' +
  [r, g, b]
    .map((x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, 0)
    )
    .join('')

// const a = hsl2rgb(30, 0.2, 0.3) // 转rgb
// const b = rgb2hex(...hsl2rgb(30, 0.2, 0.3)) // 转hex
// console.log(`hsl: (30,0.2,0.3) --> rgb: (${a}) --> hex: ${b}`)

/**
 *  处理内容 -> // 匹配括号中的内容（不包含括号） /(?<=\()(.+?)(?=\))/g
 * @param data 
 *  (?<=exp)是以exp开头的字符串, 但不包含本身.
    (?=exp)就匹配为exp结尾的字符串, 但不包含本身.
    (?<=() 也就是以括号开头, 但不包含括号.
    (?=)) 就是以括号结尾
 */
const dealHsl = (data) => {
  data = data.match(/(?<=\()(.+?)(?=\))/g)[0].split(', ')
  data[1] = ((data[1].replace('%', '') * 100) / 10000).toFixed(2)
  data[2] = ((data[2].replace('%', '') * 100) / 10000).toFixed(2)

  const hslData = hsl2rgb(...data)
  return rgb2hex(...hslData)
}
// console.log(`output->dealHsl()`, dealHsl('hsl(44, 100%, 80%)'))

const styles = [
  { name: '样式1', id: 'Head01' },
  { name: '样式2', id: 'Head02' },
  { name: '样式3', id: 'Head03' },
  { name: '样式4', id: 'Head06' },
]
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
  // 'hsl(10, 75%, 40%)',
  'hsl(180, 1%, 30%)',
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
  rotation: '旋转',
}

// 眼睛可设置的最大最小值
const minAndMax = (type) => {
  let min = 0
  let max = 10
  switch (type) {
    case 'rx':
      min = 0
      max = 80
      break
    case 'ry':
      min = 0
      max = 80
      break
    case 'cx':
      // min 太大，导致样式有些许不准确,所以通过svg数据设置时+最小值
      // min = 130
      // max = 650
      min = 0
      max = 520
      break
    case 'cy':
      // min = 180
      // max = 600
      min = 0
      max = 420
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
    case 'm_rotation':
      min = 0
      max = 360
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

const init_eye = {
  color: {
    baseColor: '#000000',
    stopColor1: '#555555',
    stopColor2: '#000000',
  },
  shadowOpacity: 0.3, // 0.2
  left: {
    rx: 19,
    ry: 19,
    cx: 176,
    cy: 160,
  },
  right: {
    rx: 19,
    ry: 19,
    cx: 356,
    cy: 160,
  },
}

export { colors, dealHsl, getLightenDarkenColor, init_eye, minAndMax, styles, typeText }

/**
 * #194199(hsl(221, 72%, 35%)
 * hsl(230, 53%, 57%)
 * #8b99ff(hsl(233, 100%, 77%)
 *
 *
 * #c89924(stopColor1: hsl(43, 69%, 46%) 200, 153, 36
 * hsl(41, 100%, 67%)  255, 202, 87
 * #fffd88(stopColor2: hsl(59, 100%, 77%)  255, 253, 138
 *
 *
 * hsl(341, 100%, 85%)
 */
