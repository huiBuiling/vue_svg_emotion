- computed

```
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
```

- 此表达式不可调用。

  - 类型 "{ min: number; max: number; }" 没有调用签名

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

  - `<component :is="comName" />` 无效
  - 新增如下，原因是在 `<script setup lang="ts">`下

  ```
  <script lang="ts">
  import Head01 from './head/Head01.vue'
  import Head02 from './head/Head02.vue'

  export default {
    components: {
      Head01,
      Head02,
    },
  }
  </script>
  ```

  - Component name "Head" should always be multi-word.
    - 文件名问题: head.vue -> HeadCon.vue 即可

- ts: 扩张参数必须具有元组类型或传递给 rest 参数

- Parsing error: ',' expected

  - 居然是重复定义变量问题

- vite + vue3 静态资源引入报错 require is not defined
