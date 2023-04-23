# 主题说明

一款二次元博客园主题 Ecy，[快速预览](https://www.cnblogs.com/Himmelbleu/#/)。

# 部署说明

部署之前，确保博客皮肤是“Custom”，且禁用 CSS 默认样式。

## 首页 HTML 代码

```html
<!-- 删除不必要的元素 -->
<script>
  $("head > link").remove();
  $("#top_nav").remove();
</script>
<!-- 主题样式 -->
<link rel="stylesheet" href="https://blog-static.cnblogs.com/files/blogs/666252/index-ecy.css" />
<style>
  /* 此项必须设置 */
  #home {
    display: none !important;
  }

  /* 以下是 loading 样式 */
  @-webkit-keyframes loading {
    0% {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes loading {
    0% {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .dark-loading {
    background: #222;
  }

  .light-loading {
    background: #fff;
  }

  .dark-loading,
  .light-loading {
    font-size: 1rem !important;
    font-weight: 400;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    z-index: 999999;
  }

  .box h2 {
    font-size: 1rem !important;
    font-weight: 400;
    color: #777;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-align: center;
  }

  .box span {
    font-size: 1rem !important;
    display: inline-block;
    vertical-align: middle;
    width: 0.6em;
    height: 0.6em;
    margin: 0.19em;
    background: #007db6;
    border-radius: 0.6em;
    -webkit-animation: loading 1s infinite alternate;
    animation: loading 1s infinite alternate;
  }

  .box span:nth-of-type(2) {
    background: #008fb2;
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  .box span:nth-of-type(3) {
    background: #009b9e;
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }

  .box span:nth-of-type(4) {
    background: #00a77d;
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }

  .box span:nth-of-type(5) {
    background: #00b247;
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
  }

  .box span:nth-of-type(6) {
    background: #5ab027;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
  }

  .box span:nth-of-type(7) {
    background: #a0b61e;
    -webkit-animation-delay: 1.2s;
    animation-delay: 1.2s;
  }
</style>
<!-- loading 元素 -->
<div class="dark-loading">
  <div class="box">
    <h2>Loading</h2>
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
  </div>
</div>
```

loading 样式可以自行设置，loading 元素最外层的类名必须是 dark-loading、light-loading 的其中一个。

## 页脚 HTML 代码

```html
<!-- 主题配置 -->
<script>
  window.__ECY_CONFIG__ = {};
</script>
<script type="module" src="https://blog-static.cnblogs.com/files/blogs/666252/index-ecy.js"></script>
```

## 其他设置

博客园后台“选项”，勾选“启用数学公式支持”和“数学公式渲染引擎”，请选择 MathJax3，否则数学公式不生效。

# 部署问题

长时间停在 loading；控制台报错过多；

- 可能是你的配置项没有添加非可选字段；
- 可能是你的配置项字段结尾处没有逗号。

# 配置说明

## 个人铭牌

让别人可以快速地了解博主的信息。本页面通过小工具箱（屏幕右侧）的按钮中跳转过来，或可以直接输入 url（你的域名`/profile`）。

```js
window.__ECY_CONFIG__ = {
  nameplate: {
    // 个性签名
    signature: "your text",
    // 个人标签
    tags: ["程序人生", "习惯计划"],
    // 联系方式
    connection: [
      {
        name: "Bilibili",
        text: "https://space.bilibili.com/7021686",
        img: "https://images.cnblogs.com/cnblogs_com/blogs/666252/galleries/2281365/o_230306161713_bilibili.png"
      }
    ],
    // 自我介绍
    intro:
      "Hi~😃欢迎来到我的博客！我很喜欢 Web 前端开发，享受它给我带来的乐趣，接触过 Vue、Scss、UnoCSS、Vite、uniapp、安卓开发、微信小程序等。<br /><br />平时喜欢逛 B站，刷短视频、看 Vtuber（DD），如果有喜欢的电视剧就会狂刷。",
    // 闲言碎语
    gossip: "<ul><li>研究 TypeScript 类型</li><li>学习物联网</li>",
    // 我的相册
    photo: {
      src: [],
      disabled: true
    },
    // 推荐仓库
    warehouse: [{ text: "cnblogs-theme-ecy", url: "http://www.gitee.com/Himmelbleu/cnblogs-theme-ecy" }],
    // 项目经历
    experience: [{ text: "德昌红色傈乡景区", date: "22.12.10" }]
  }
};
```

### 技能雷达

```js
window.__ECY_CONFIG__ = {
  graph: {
    alpha: 0.85,
    sides: 5, // 多少个边
    layer: 5, // 多少层
    lineWidth: 1,
    textSize: 12,
    comment: [
      // 数据，长度必须和 sides 保持一致
      { title: "CSS", star: 4 },
      { title: "Vue", star: 4 },
      { title: "Java", star: 3 },
      { title: "JS/TS", star: 4 },
      { title: "Android", star: 3 }
    ]
  }
};
```

## 背景图片

提供背景图片，filter 更改图片的模糊度，matte 更改图片的遮罩。

index：首页顶部的背景图片是一个重复的随机图片；

works：作品顶部的背景图片也是一个重复的随机图片。works 数组还给归档、首页作品列表提供背景图片，这两个页面的背景图片如果大于或等于列表项的数量，就不是一个重复的随机背景图片，而是一个不重复的，且切换页数时可以变化的随机数。

```js
window.__ECY_CONFIG__ = {
  covers: {
    // 模糊度
    filter: {
      index: "2px",
      works: "20px"
    },
    // 遮罩
    matte: {
      index: 0.1,
      works: 0.1
    },
    // 封面
    index: [
      "https://images.cnblogs.com/cnblogs_com/blogs/666252/galleries/2302503/o_230420153800_95785723_p0.png",
      "https://images.cnblogs.com/cnblogs_com/blogs/666252/galleries/2302503/o_230420154313_86093780_p0.jpg"
    ],
    // 封面，大于或等于列表项数量时，生成的是一个不重复的数组
    works: [
      "https://images.cnblogs.com/cnblogs_com/blogs/666252/galleries/2302503/o_230420154313_86093780_p0.jpg",
      "https://images.cnblogs.com/cnblogs_com/blogs/666252/galleries/2302503/o_230420154438_77055913_p0.jpg"
    ]
  }
};
```

## 陈列柜

在首页开屏的背景图片中上方的左右两侧处呼出陈列柜。

- 左陈列柜主要展示博客原有的信息，如博主信息、随笔分类、标签分类、博客日历等。
- 右陈列柜主要展示由本皮肤提供的额外的可展示的信息。

### 推荐链接

```js
window.__ECY_CONFIG__ = {
  cabinet: {
    links: [
      {
        href: "http://ts.xcatliu.com/index.html",
        text: "TypeScript 入门教程"
      }
    ]
  }
};
```

### 推荐书籍

```js
window.__ECY_CONFIG__ = {
  cabinet: {
    books: [
      {
        href: "https://baike.baidu.com/item/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3JavaScript/19848692",
        text: "深入理解 JavaScript",
        img: "http://img3m1.ddimg.cn/85/1/11120396251-1_w_1.jpg",
        author: "[美]罗彻麦尔",
        rate: 4.5
      }
    ]
  }
};
```

## 主题字体

你可以自定义代码的字体，假如你的电脑上安装了 Space Mono 字体，可以对博客的代码进行设置。

```js
window.__ECY_CONFIG__ = {
  font: {
    // 不设置主要的字体时给一个空字符串
    main: "",
    // 代码字体
    code: `"Space Mono", Hack`
  }
};
```

你也可以从网络上加载字体，在“首页 HTML 代码”添加 link 标签引入网络字体。

## 其他配置

```js
window.__ECY_CONFIG__ = {
  // 浏览器标签图标
  icon: "",
  // 头像，我的铭牌页和左陈列柜需要
  avatar: ""
};
```
