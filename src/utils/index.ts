const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

const getLightenDarkenColor_1 = (col, amt) => {
  const result: {
    r: number
    g: number
    b: number
  } = hexToRgb(col) || {
    r: 250,
    g: 250,
    b: 250,
  }

  return `rgba(${result.r + amt},${result.g + amt},${result.b + amt})`
}

const getLightenDarkenColor = (col, amt) => {
  let usePound = false

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

export { getLightenDarkenColor, hexToRgb }

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
