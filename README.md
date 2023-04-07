# 主题说明

一款二次元博客园主题 Ecy，[快速预览](https://www.cnblogs.com/Himmelbleu/#/)。

# 部署说明

部署之前，确保博客皮肤是“Custom”，且禁用 CSS 默认样式。

首页 HTML 代码：

```html
<!-- clear unused elems -->
<script>
  $("head > link").remove();
  $("#top_nav").remove();
</script>
<!-- ecy style -->
<link rel="stylesheet" href="https://blog-static.cnblogs.com/files/blogs/666252/index-ecy.css" />
<!-- ecy loading style -->
<style>
  #home {
    display: none !important;
  }

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
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif !important;
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
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif !important;
    font-weight: 400;
    color: #777;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-align: center;
  }

  .box span {
    font-size: 1rem !important;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif !important;
    font-weight: 400;
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
<!-- ecy loading -->
<div class="dark-loading">
  <div class="box">
    <h2>Loading</h2>
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
  </div>
</div>
```

页脚 HTML 代码：

```html
<!-- ecy config -->
<script>
  window.__ECY_CONFIG__ = {};
</script>
<script type="module" src="https://blog-static.cnblogs.com/files/blogs/666252/index-ecy.js"></script>
```

在你的博客园后台“选项”中，勾选“启用数学公式支持”和“数学公式渲染引擎”（选择 MathJax3），否则数学公式不生效。

# 部署问题

1. 长时间停在 loading；
2. 控制台报错过多；

解决：多刷新几次 / 清除浏览器缓存。

# 配置说明

## 个人铭牌

```js
window.__ECY_CONFIG__ = {
  nameplate: {
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

## GitHub

```js
window.__ECY_CONFIG__ = {
  github: "your github address"
};
```

|  字段  |                  描述                  | 可选值 |
| :----: | :------------------------------------: | :----: |
| github | github 角标，在浏览器左上角，PC 端可见 |        |

## 陈列柜

```js
window.__ECY_CONFIG__ = {
  cabinet: {
    avatar: "url",
    signature: "your text",
    navs: [
      // 可以插入图片、文本、svg
      {
        href: "https://i.cnblogs.com/posts/edit",
        text: "新随笔"
      },
      {
        href: "https://gitee.com/Enziandom",
        svg: `<path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m259.2-569.6H480c-12.8 0-25.6 12.8-25.6 25.6v64c0 12.8 12.8 25.6 25.6 25.6h176c12.8 0 25.6 12.8 25.6 25.6v12.8c0 41.6-35.2 76.8-76.8 76.8h-240c-12.8 0-25.6-12.8-25.6-25.6V416c0-41.6 35.2-76.8 76.8-76.8h355.2c12.8 0 25.6-12.8 25.6-25.6v-64c0-12.8-12.8-25.6-25.6-25.6H416c-105.6 0-188.8 86.4-188.8 188.8V768c0 12.8 12.8 25.6 25.6 25.6h374.4c92.8 0 169.6-76.8 169.6-169.6v-144c0-12.8-12.8-25.6-25.6-25.6z""></path>`
      }
    ]
  }
};
```

|   字段    |      描述      |
| :-------: | :------------: |
|  avatar   |      头像      |
| signature |    个性签名    |
|   navs    | 左陈列柜导航项 |

## 技能栈

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

## 推荐链接

```js
window.__ECY_CONFIG__ = {
  links: [
    {
      href: "http://ts.xcatliu.com/index.html",
      text: "TypeScript 入门教程"
    }
  ]
};
```

## 推荐书籍

```js
window.__ECY_CONFIG__ = {
  books: [
    {
      href: "https://baike.baidu.com/item/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3JavaScript/19848692",
      text: "深入理解 JavaScript",
      img: "http://img3m1.ddimg.cn/85/1/11120396251-1_w_1.jpg",
      author: "[美]罗彻麦尔",
      rate: 4.5
    }
  ]
};
```

# 二次开发

```bash
npm install
npm run dev
npm build
```

二次开发需要把 build 之后的 index.css、index.js 上传到博客园后台“文件”。并获取这两个文件的链接，以替换部署说明中标签的引入链接。

建议多使用 UnoCSS，开发时请把 `.env.development` 中两个字段修改成你自己的，否则获取的数据是我本人博客上的，博客 ID 和博客 App 都可以 F12 查看你博客找到，搜索`currentBlogId` 和`currentBlogApp`。
