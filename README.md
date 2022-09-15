# vue3-svg

## 参考这些个大大的作品：
- https://github.com/Codennnn/vue-color-avatar
- https://fffuel.co/ccclaymoji/

## 运行
- git clone xxx
- yarn -> yarn dev

## 效果预览

- 对应分支：master or v_pinia, 区别与是否有使用pinia
![image](https://github.com/huiBuiling/vue3-temple/blob/master/result.png)

- 对应分支：main
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
