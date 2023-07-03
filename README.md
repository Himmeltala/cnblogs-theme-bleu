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
- 支持自定义导航栏菜单项、悬浮标题目录等。
- 项目结构清晰，代码简单，可实现高度定制化开发。

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

编辑器推荐选择 markdown，主题特性是基于 markdown 编辑的文本内容进行开发的。数学公式必须选择 MathJax3，其余的选项可以自行设置。

## 控件设置

![](./docs/image-4.png)

- 控件选项仅供参考。

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
<link rel="stylesheet" href="https://fonts.loli.net/icon?family=ZCOOL+KuaiLe" />
<link
  rel="stylesheet"
  href="https://cdn.bootcdn.net/ajax/libs/hack-font/3.3.0/web/hack-subset.min.css" />
<link
  rel="stylesheet"
  href="https://cdn.bootcdn.net/ajax/libs/lxgw-wenkai-webfont/1.6.0/style.min.css" />

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

## 代码块标注

有时候代码块需要特意说明是哪个文件的，或者说明文件的路径等标注信息，在文本中直接说明有点繁琐，因此你只需要按照以下格式就可以实现一个代码块标注。

在代码块内第一行写上代码块标注。

`file:[src/math_utils.js]`

## 代码块行高亮

很多的博客、文档的代码块有删除行、增加行的背景高亮。这样让我们阅读的时候清楚地知道哪里改动，不需要过多的文字描述。

所以，你只需要使用以下格式就可以让你的代码块中呈现删除或增加的高亮背景。

在代码块中需要显示的地方使用 del:[] 或者 add:[]。

- 删除 `del:[]`
- 增加 `add:[]`

```js
function add(x, y) {
  del:[return x + y]
  add:[return y + x]
}
```

## 主题更新

因博客园有缓存，更改 `https://blog-static.cnblogs.com/files/blogs/666252/index-bleu.js?t=20230708117` 链接中 `t` 等于的值，可以是日期，也可以是其他值。更改完成之后，就可以获取到最新的主题。

# 配置主题

## theme

- 类型：object
- 是否必填：否

主题相关，比如颜色。

```js
window.__BLEU_CONFIG__ = {
  theme: {
    // 默认颜色
    color: "#409EFF"
  }
};
```

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
      repeat: "repeat"
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
    arbeiten: [
      ""
    ]
  }
};
```

随笔和文章列表封面图不超过 10 个时，会重复看到图片。

## chart

- 类型：object
- 是否必填：是

（1）技能雷达

技能雷达完全符合 echart 雷达图的配置，具体请查看 [echart 雷达图示例](https://echarts.apache.org/examples/zh/index.html#chart-type-radar)。

```js
window.__BLEU_CONFIG__ = {
  chart: {
    // 我的技能，该属性和 echart 雷达图配置完全一致，可以参考官方文档来填写
    tech: {
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
          // 区域颜色
          areaStyle: {},
          // 线条颜色
          lineStyle: {},
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

技能雷达的区域颜色和线条颜色的配置：[areaStyle](https://echarts.apache.org/zh/option.html#series-radar.areaStyle)、[lineStyle](https://echarts.apache.org/zh/option.html#series-radar.lineStyle)。

这两个属性是 series 数组中对象元素下的属性，配置时不要配置错误了。

（2）随笔归档折线图

点击链接查看 [areaStyle](https://echarts.apache.org/zh/option.html#series-line.areaStyle)、[lineStyle](https://echarts.apache.org/zh/option.html#series-line.lineStyle)。

```js
window.__BLEU_CONFIG__ = {
  chart: {
    // 随笔分类饼状图统计前 count 个，可以不填，默认 10 个
    category: {
      count: 10,
      areaStyle: {},
      lineStyle: {}
    }
  }
};
```

## font

- 类型：object
- 是否必填：否

配置主题的字体，默认字体使用 Element-Plus 的字体集。你可以配置你自己喜欢的字体。

1. 在“页首 HTML 代码”处插入一个字体 cdn 或者字体网址的 link 标签，表示引入字体到博客中。
2. 得到字体名称。
3. 在配置文件中配置。

在 “页首 HTML 代码” 处添加以下三个 link 标签，如果你有其他的字体可以替换我给的例子：

```html
<link rel="stylesheet" href="https://fonts.loli.net/icon?family=ZCOOL+KuaiLe" />
<link
  rel="stylesheet"
  href="https://cdn.bootcdn.net/ajax/libs/hack-font/3.3.0/web/hack-subset.min.css" />
<link
  rel="stylesheet"
  href="https://cdn.bootcdn.net/ajax/libs/lxgw-wenkai-webfont/1.6.0/style.min.css" />
```

字体有三处配置：

（1）主要字体：所看见的绝大部分文字都是主要字体。

（2）代码字体：代码块中的字体。

（3）艺术字体：标题，菜单栏的字体。

```js
window.__BLEU_CONFIG__ = {
  font: {
    code: {
      name: "Hack, LXGW WenKai",
      // 修改代码块的字体大小，单位建议 rem
      size: "0.8rem"
    },
    main: {
      // 主要的字体样式，建议 LXGW WenKai，这个字体我认为非常美观
      name: "LXGW WenKai"
    },
    art: {
      name: "ZCOOL KuaiLe",
      // 修改艺术字体大小，单位建议 rem
      size: "1.2rem"
    }
  }
};
```

## styleCss

- 类型：object
- 是否必填：否

配置 markdown 以及图片放大器样式。arbeiten 和 comment 符合 JS 的 style 样式对象。

```js
window.__BLEU_CONFIG__ = {
  styleCss: {
    arbeiten: {
      fontSize: "1.1rem"
    },
    comment: {
      fontSize: "1rem"
    }
  }
};
```

对于图片放大器，值必须是 UnoCSS，如 flex flex-wrap flex-col 等，具体可以查阅 [UnoCSS 交互文档](https://unocss.dev/interactive/)。

其中 f-c-c 是本主题设置的 shortcuts，对照以下的值来设置。

```js
const keys = [
  { k: "c", v: "center" },
  { k: "s", v: "start" },
  { k: "e", v: "end" },
  { k: "b", v: "between" },
  { k: "a", v: "around" }
];
```

```js
window.__BLEU_CONFIG__ = {
  styleCss: {
    amplifier: "f-c-c"
  }
};
```
