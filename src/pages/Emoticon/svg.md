- svg：

  - 参考：
    - https://blog.csdn.net/Z_2010317/article/details/125854597
    - https://www.runoob.com/svg/svg-tutorial.html
  - filter: 为 svg 元素添加阴影
    - eg: filter="url(#mouth-shadow)"
  - 滤镜：

    - 类型：
      - feBlend:与图像相结合的滤镜
      - feColorMatrix:用于彩色滤光片转换
      - feGaussianBlur:模糊滤镜
      - feMerge:多滤镜叠加滤镜
      - feOffset:过滤阴影
      - feDistantLight:用于照明过滤
    - 模式：normal — 正常 | multiply — 正片叠底 | screen — 滤色 | darken — 变暗 | lighten— 变亮
    - 属性：
      - x，y：提供左上角的坐标俩定义在哪里渲染滤镜效果(默认值:0)
      - width,height：绘制滤镜容器的高度(默认都为 100%)
      - result：用于定义一个滤镜效果的输出名字，以便将其用作另一个滤镜效果的输入(in)
      - in：指定滤镜效果的输入源,可以是某个滤镜导出的 result,也可以是下面 6 个值

  - <defs> 和 <filter>
    - <defs>短并含有特殊元素（如滤镜）
    - <filter>定义 SVG 滤镜, 使用必需的 id 属性来定义向图形应用哪个滤镜

- Shapes

  - 矩形：<rect>

    - width 和 height
    - CSS 属性

      - fill 属性定义矩形的填充颜色（rgb 值、颜色名或者十六进制值）
      - stroke-width 属性定义矩形边框的宽度
      - stroke 属性定义矩形边框的颜色

    - 简单矩形

    ```
      <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
    ```

    - 带边框矩形，包含位置设置
      - x：到浏览器窗口左侧的距离,y：到浏览器窗口顶端的距离
      - fill-opacity： 填充颜色透明度（合法的范围是：0 - 1）
      - stroke-opacity： 轮廓颜色的透明度（合法的范围是：0 - 1）

    ```
      <rect x="50" y="20" width="150" height="150"
      style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9"/>
    ```

    - 圆角矩形
      - rx 和 ry 属性可使矩形产生圆角

    ```
      <rect x="50" y="20" rx="20" ry="20" width="150" height="150"
      style="fill:red;stroke:black;stroke-width:5;opacity:0.5"/>
    ```

  - 圆形：<circle>
    - cx 和 cy: x 和 y 坐标。如果省略 cx 和 cy，圆的中心会被设置为(0, 0)
    - r: 圆的半径
    - 基础
    ```
      <circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="red"/>
    ```
  - 椭圆：<ellipse>

    - cx: 椭圆中心的 x 坐标
    - cy: 椭圆中心的 y 坐标
    - rx: 水平半径
    - ry: 垂直半径

    ```
      <ellipse cx="300" cy="80" rx="100" ry="50" style="fill:yellow;stroke:purple;stroke-width:2"/>
    ```

    - 叠加椭圆

    ```
      <ellipse cx="240" cy="100" rx="220" ry="30" style="fill:purple" />
      <ellipse cx="220" cy="70" rx="190" ry="20" style="fill:lime" />
      <ellipse cx="210" cy="45" rx="170" ry="15" style="fill:yellow" />

      or
      <ellipse cx="240" cy="50" rx="220" ry="30" style="fill:yellow" />
      <ellipse cx="220" cy="50" rx="190" ry="20" style="fill:white" />
    ```

  - 多边形：<polygon>
    - https://www.runoob.com/svg/svg-polygon.html
    - points 属性定义多边形每个角的 x 和 y 坐标
    - fill-rule:
      - 用于指定使用哪一种算法去判断画布上的某区域是否属于该图形“内部” （内部区域将被填充）
      - nonzero(默认) / evenodd / inherit
    ```
      <polygon points="200,10 250,190 160,210" style="fill:lime;stroke:purple;stroke-width:1"/>
    ```
  - 直线：<line>
    - x1, x2: x 轴定义线条的开始,结束
    - y1, y2: y 轴定义线条的开始,结束
    ```
      <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2"/>
    ```
  - 折线：<polyline>
    ```
      <polyline points="0,40 40,40 40,80 80,80 80,120 120,120 120,160" style="fill:white;stroke:red;stroke-width:4" />
    ```
  - 路径：<path>

    - https://www.runoob.com/svg/svg-path.html
    - 注意：以下所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位。
    - M = moveto
    - L = lineto
    - H = horizontal lineto
    - V = vertical lineto
    - C = curveto
    - S = smooth curveto
    - Q = quadratic Bézier curve
    - T = smooth quadratic Bézier curveto
    - A = elliptical Arc
    - Z = closepath

    - 定义了一条路径，它开始于位置 150 0，到达位置 75 200，然后从那里开始到 225 200，最后在 150 0 关闭路径

    ```
      <path d="M150 0 L75 200 L225 200 Z" />
    ```

  - 文本：

    ```
      <text x="0" y="15" fill="red" transform="rotate(30 20,40)">I love SVG</text>
    ```

    - 路径上的文字

    ```
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <path id="path1" d="M75,20 a1,1 0 0,0 100,0" />
      </defs>
      <text x="10" y="100" style="fill:red;">
        <textPath xlink:href="#path1">I love SVG I love SVG</textPath>
      </text>
    </svg>
    ```

- stroke 属性

  - 定义一条线，文本或元素轮廓颜色
  - stroke: 颜色
  - stroke-width：宽度
  - stroke-linecap：开放路径的终结类型（butt | round | square
  - stroke-dasharray: 线类型（10,10 | 20,10,5,5,5,10

  ```
    <g fill="none" stroke="black" stroke-width="4">
      <path stroke-dasharray="5,5" d="M5 20 l215 0" />
      <path stroke-dasharray="10,10" d="M5 40 l215 0" />
      <path stroke-dasharray="20,10,5,5,5,10" d="M5 60 l215 0" />
    </g>
  ```

- 滤镜:<feGaussianBlur> -> (<defs> 和 <filter>)
  - https://www.runoob.com/svg/svg-filters-intro.html
- 模糊效果
- 阴影:<feOffset> -> (<defs> 和 <filter>)
- 渐变
  - 线性:<linearGradient>
  - 放射性:<radialGradient>
