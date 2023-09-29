<p align="center">CNBLOGS-THEME-BLEU</p>

<p align="center">
一个简单的博客主题。支持数学公式、部分数据有图表统计、部分可配置。
</p>

<p align="center">
快速预览：https://www.cnblogs.com/himmelbleu
</p>

[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/himmelbleu/cnblogs-theme-bleu?include_prereleases&style=flat-square)](https://github.com/himmelbleu/cnblogs-theme-bleu/releases)

## 特性

- 界面简洁优雅，响应式网页设计。
- 轻量配置，非常容易使用。
- 提供暗黑模式和多种色彩主题，可随时切换。

## 开发

```bash
# 克隆代码
git clone git@github.com:Himmelbleu/cnblogs-theme-bleu.git

# 进入目录
cd cnblogs-theme-bleu

# 安装依赖
pnpm install

# 本地调试
pnpm start

# 编译发布
pnpm run build
```

# 开始配置

## 基本设置

![](./docs/image-2.png)

- 开启 JS 权限。
- 博客皮肤请选择 Custom。

## 代码高亮

![](./docs/image-1.png)

- 禁用默认代码高亮。
- 其余设置可选，但用处不大。

## 博客选项

![](./docs/image-3.png)

- 编辑器推荐选择 markdown，主题特性是基于 markdown 编辑的文本内容进行开发的。
- 数学公式必须选择 MathJax3，其余的选项可以自行设置。

## 控件设置

![](./docs/image-4.png)

上图所示控件选项仅供参考。

## 页首 HTML 代码

```html
<!-- 移除不必要的 DOM -->
<script>
  $("head > link").remove();
  $("#top_nav").remove();
</script>

<!-- 主题样式 -->
<link
  rel="stylesheet"
  href="https://blog-static.cnblogs.com/files/blogs/666252/index-bleu.css?t=202307090102" />

<!-- 推荐字体 -->
<link
  rel="stylesheet"
  href="https://cdn.bootcdn.net/ajax/libs/hack-font/3.3.0/web/hack-subset.min.css" />

<!-- 加载动画 CSS -->
<style>
  #home {
    display: none !important;
  }

  .loading {
    z-index: 9999999;
    background-color: #222222;
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .triangle1 {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4rem 4rem 0 0;
    border-color: #354952 transparent transparent transparent;
    margin: 0 auto;
    animation: triangle1-start 1s ease-in-out infinite normal;
  }

  .triangle2 {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 4rem 4rem;
    border-color: transparent transparent #df1a54 transparent;
    margin: -4rem auto 0;
    animation: triangle2-start 1s ease-in-out infinite alternate;
  }

  @keyframes triangle1-start {
    0% {
      transform: rotate(-360deg);
    }

    100% {
    }
  }

  @keyframes triangle2-start {
    0% {
      transform: rotate(360deg);
    }

    100% {
    }
  }

  .text {
    color: #a7a7a7;
    font-weight: 100;
    text-align: center;
    margin-top: 3rem;
    letter-spacing: 0.8rem;
  }
</style>

<!-- 加载动画 HTML 结构 -->
<div class="loading">
  <div>
    <div class="triangle1"></div>
    <div class="triangle2"></div>
    <h4 class="text">loading</h4>
  </div>
</div>
```

## 页脚 HTML 代码

```html
<!-- 主题配置 -->
<script>
  // 主题的配置对象
  window.__BLEU_CONFIG__ = {};
</script>
<!-- 主题 JS -->
<script
  type="module"
  src="https://blog-static.cnblogs.com/files/blogs/666252/index-bleu.js?t=202307090102"></script>

<!-- 鼠标特效 -->
<script src="https://blog-static.cnblogs.com/files/yjlblog/cursor-effects.js"></script>
```

# 主题特性

## 传送门

区别于普通的文字链接，传送门居中，是一个卡片的链接，可以展示封面、标题和链接。

在 markdown 中，我们这样写：

![](./docs/image-11.png)

打开随笔，查看效果：

![](./docs/image-12.png)

## 提示块

提示块可以让我们写下一些提示，这块内容会被绿色背景包裹，按照以下格式：

![](./docs/image-5.png)

以 `tip:[start]` 开始，以 `tip:[end]` 结尾，把提示内容写在中间。写完之后，打开随笔页面，就可以查看到效果：

![](./docs/image-6.png)

## 注意块

注意块可以让我们写下一些注意，这块内容会被红色背景包裹，按照以下格式：

![](./docs/image-7.png)

以 `war:[start]` 开始，以 `war:[end]` 结尾，把注意内容写在中间。写完之后，打开随笔页面，就可以查看到效果：

![](./docs/image-8.png)

## 代码块标注

有时候代码块需要特意说明是哪个文件的，或者说明文件的路径等标注信息，在文本中直接说明有点繁琐，因此你只需要按照以下格式就可以实现一个代码块标注。

在代码块内第一行写上代码块标注。

`file:[src/math_utils.js]`

## 代码块删除行或增加行高亮

在编写文档时，标注代码块中某些行较上一次的改动，你只需要使用以下格式就可以让你的代码块中某些行呈现删除或增加的高亮背景。

- 删除格式：`del:[xxxxxxxxxxxxxx]:del`
- 增加格式：`add:[xxxxxxxxxxxx]:add`

```js
del:[function add(x, y) {
function calc(x, y) {]:del
  add:[return x + y
  return y + x
}]:add
```

## 代码块行高亮提示

在编写文档时，代码块中某些行需要额外注意时，你只需要使用以下格式就可以让你的代码块中某些行呈现高亮背景。

格式：`lit:[]`

```js
lit:[function add(x, y) {
function calc(x, y) {
  return x + y
  return y + x
}]:lit
```

## 主题更新

因博客园有缓存，更改 `https://blog-static.cnblogs.com/files/blogs/666252/index-bleu.js?t=20230708117` 链接中 `t` 等于的值，可以是日期，也可以是其他值。更改完成之后，就可以获取到最新的主题。

# 配置主题

## theme

- 类型：object
- 是否必填：否

```html
<link
  rel="stylesheet"
  href="https://cdn.bootcdn.net/ajax/libs/hack-font/3.3.0/web/hack-subset.min.css" />
```

```js
window.__BLEU_CONFIG__ = {
  theme: {
    cssvar: {
      codeFamily: "Hack"
    }
  }
};
```

## icon

- 类型：string
- 是否必填：否

网站 icon，显示在浏览器标签页。

```js
window.__BLEU_CONFIG__ = {
  icon: ""
};
```

## signature

- 类型：string
- 是否必填：否

个性签名显示在博客信息底部，文字超过两行会被隐藏（出于布局的考虑）。

```js
window.__BLEU_CONFIG__ = {
  signature: "Time tick away, dream faded away."
};
```

## status

- 类型：string
- 是否必填：否

插入一个 emoji 表情，表示自己的状态，例如：🐟 表示自己在摸鱼中。

```js
window.__BLEU_CONFIG__ = {
  status: "🐟"
};
```

## avatar

- 类型：string
- 是否必填：否

个人头像显示在博客信息顶部，请插入不宜过大的网络图片。

```js
window.__BLEU_CONFIG__ = {
  avatar: ""
};
```

## images

- 类型：object
- 是否必填：否

该配置项包括了背景图片、首页轮播图、文章和随笔列表封面图。以下的 background、home 等对象都是可选，也就是可以忽略不填，但是 arbeiten 字段至少要给一个网络图片地址，否则随笔列表的封面就是破损图片，除非你在发表一篇博客之前给了一个封面。

```js
window.__BLEU_CONFIG__ = {
  images: {
    // 背景，不填背景图片就是纯色背景
    background: {
      // 网络图片
      src: ""
      // 透明度
      opacity: 0.03,
      // 同 css background-size
      size: "50% auto",
      // 同 css background-repeat
      repeat: "repeat",
      // 同 css background-position
      position: "100%"
    },
    // 首页轮播图，不填代表关闭
    home: {
      // 透明度
      opacity: 0.5,
      // 轮播间隔，单位毫秒
      interval: 5000,
      // 轮播列表
      carousel: [
        ""
      ],
      // 首页轮播图不开启时，以第二种布局代替轮播图位置。
      disabled: true
    },
    // 随笔和文章列表封面图
    stochastic: [
      ""
    ]
  }
};
```

随笔和文章列表封面图不超过 10 个时，会重复看到图片。

## echart

- 类型：object
- 是否必填：是

查看官方示例 [echart 雷达图示例](https://echarts.apache.org/examples/zh/index.html#chart-type-radar)。

color 推荐的颜色选择：

<span style="color: #409EFF">#409EFF</span>
<span style="color: #2D8CF0">#2D8CF0</span>
<span style="color: #FA7298">#FA7298</span>
<span style="color: #42B983">#42B983</span>
<span style="color: #607D8B">#607D8B</span>
<span style="color: #5E72E4">#5E72E4</span>
<span style="color: #FF9700">#FF9700</span>
<span style="color: #009688">#009688</span>
<span style="color: #673BB7">#673BB7</span>
<span style="color: #906f61">#906f61</span>

```js
window.__BLEU_CONFIG__ = {
  echart: {
    color: "#409EFF",
    // 我的技能，该属性和 echart 雷达图配置完全一致，可以参考官方文档来填写
    technics: {
      radar: {
        // 点
        indicator: [
          { name: "Vue", max: 5 },
          { name: "React", max: 5 },
          { name: "JS", max: 5 },
          { name: "TS", max: 5 },
          { name: "Python", max: 5 },
          { name: "C", max: 5 },
          { name: "Java", max: 5 },
          { name: "MySQL", max: 5 },
          { name: "Mybatis", max: 5 }
        ]
      },
      // 雷达图
      series: [
        {
          // 图表类型
          type: "radar",
          // 数据，与 indicator 的数量保持一致
          data: [
            {
              value: [4, 1, 4, 3, 3.5, 1, 3.5, 2.5, 3.5],
              name: "技能掌握程度"
            }
          ]
        }
      ]
    }
  }
};
```

## fancybox

- 类型：object
- 是否必填：否

配置图片查看器。具体可以查阅 [Options | Fancybox](https://fancyapps.com/fancybox/api/options/)。

```js
window.__BLEU_CONFIG__ = {
  fancybox: {
    Toolbar: {
      display: {
        left: ["infobar"],
        middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
        right: ["slideshow", "thumbs", "close"]
      }
    },
    Hash: false
  }
};
```
