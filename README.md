# vue3-svg

## 效果预览

![image](https://github.com/huiBuiling/vue3-temple/blob/main/result.png)

# svg.js

- yarn add @svgdotjs/svg.js

此表达式不可调用。
类型 "{ min: number; max: number; }" 没有调用签名

- vue3 的 computed 计算属性传参

  - 错误写法 -> eyeMin is not function

  ```
  <input ... :max="eyeMin(item).max || 10" />

  const eyeMin = computed((type: string) => {
    console.log(`output->computed`, type) // 获取不到
    ...
    return 10
  })
  ```

  - 正确写法

  ```
    const eyeMin = computed(() => {
      return function (type: string) {
        console.log(`output->computed`, type)
        ...
        return 10
      }
    })

    but： eyeMin is not a function
    const percent = (cur: number, type: string) => {
      const _cur = eyeMin(type)
    }
  ```
