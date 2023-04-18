import $ from "jquery";

export namespace EcyConfig {
  export let __ECY_CONFIG__: CustType.IEcy;
  export let blogId = 0;
  export let baseAPI = "";
  export let blogApp = "";
  export let isLogin = true;
  export let isOwner = true;
  export let userGuid = "";
  export let isFollow = false;
  export const pcDevice = isPcDevice();

  /**
   * 判断设备是否是 PC 端
   */
  function isPcDevice() {
    return !/iPhone|iPad|iPod|Android|IEMobile/.test(navigator.userAgent);
  }

  /**
   * 初始化博客重要变量，这些变量不能通过 head script 获取，在一些元素属性上。
   */
  function getUserGuid() {
    return $("#p_b_follow > a")?.attr("onclick")?.split("(")[1]?.split(")")[0]?.replaceAll("'", "") ?? "";
  }

  /**
   * 初始化博客重要变量，这些变量不能通过 head script 获取，在一些元素属性上。
   */
  function getIsFollow() {
    return $("#p_b_follow > a")?.text() === "-取消关注" ?? false;
  }

  function initLocalSetting() {
    const setting = EcyUtils.getLocalSetting().value;
    const strings = JSON.stringify(EcyUtils.reloadObjProps(setting, EcyUtils.getLocalSettingTemp()));
    localStorage.setItem(`l-${blogApp}-setting`, strings);
    $("html").attr("class", setting.theme.mode);
  }

  /**
   * 初始化 lite，所有工作准备完成之后，走回调函数，挂载 app。
   * @param dev 开发模式下直接挂载 app
   * @param pro 生产模式下，打包部署之后，给 window 注册一个函数，等待博客园资源加载完成之后再挂载 app。
   */
  export function useLite(dev: Function, pro: Function) {
    $("body").append(`<div id="app"></div>`);
    $("head").append(`<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack-subset.css" />`);

    if (import.meta.env.PROD) {
      blogId = currentBlogId;
      blogApp = currentBlogApp;
      isLogin = isLogined;
      isOwner = isBlogOwner;
      baseAPI = `https://www.cnblogs.com/${blogApp}`;
      userGuid = getUserGuid();
      isFollow = getIsFollow();
      // @ts-ignore
      __ECY_CONFIG__ = window["__ECY_CONFIG__"];
      initLocalSetting();
      pro();
    } else if (import.meta.env.DEV) {
      blogId = import.meta.env.VITE_BLOG_ID;
      blogApp = import.meta.env.VITE_BLOG_APP;
      EcyConfig.blogApp = import.meta.env.VITE_BLOG_APP;
      baseAPI = "/api";
      __ECY_CONFIG__ = {
        cabinet: {
          signature: "Time tick away, dream faded away!"
        },
        covers: {
          works: [
            "https://img1.baidu.com/it/u=726526983,4132763702&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500",
            "https://img0.baidu.com/it/u=2862888988,3851280368&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889",
            "https://img0.baidu.com/it/u=1378108440,2977662023&fm=253&fmt=auto&app=138&f=JPEG?w=281&h=500",
            "https://img.win3000.com/m00/d1/c4/85045c91eedd2953ea148b22fb7d592a.jpg",
            "https://img2.baidu.com/it/u=3529812522,165675595&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
            "https://img1.baidu.com/it/u=4014731863,2947911801&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800",
            "https://img0.baidu.com/it/u=3799846776,4059990499&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313",
            "https://n.sinaimg.cn/sinakd10118/1/w1081h1320/20210910/525d-98224496d08d222e095510ad859b6d98.jpg",
            "https://img2.baidu.com/it/u=1194562060,1998366528&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=1422",
            "https://img2.baidu.com/it/u=888702446,3413998468&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889"
          ],
          index: [
            "https://gzw.sinaimg.cn/large/0073YlnVgy1h8apu19t61j32yo1o0x6v.jpg",
            "https://gzw.sinaimg.cn/large/0073YlnVgy1h8aptjk8obj32y31wwnlv.jpg",
            "https://gzw.sinaimg.cn/large/0073YlnVgy1h8aptwnz55j337f1yib2e.jpg",
            "https://gzw.sinaimg.cn/large/0073YlnVgy1h4smbf7pn8j31cw0qcn76.jpg"
          ]
        },
        graph: {
          alpha: 0.85,
          sides: 9,
          layer: 6,
          lineWidth: 1,
          textSize: 0.8,
          data: [
            { title: "scss", star: 5 },
            { title: "vue3", star: 5 },
            { title: "vite", star: 4 },
            { title: "js", star: 5 },
            { title: "ts", star: 4 },
            { title: "C", star: 2 },
            { title: "react", star: 2 },
            { title: "uniapp", star: 5 },
            { title: "java", star: 4 }
          ]
        },
        nameplate: {
          tags: ["Web 前端", "二次元", "简约", "拖延症", "吸猫"],
          connection: [
            {
              name: "Email",
              text: "zhengrenfu@outllok.com",
              img: "https://images.cnblogs.com/cnblogs_com/blogs/666252/galleries/2281365/o_230306161009_wechat.png"
            }
          ],
          intro: "平时喜欢逛 B站，刷短视频、看 Vtuber（DD），如果有喜欢的电视剧就会狂刷。",
          warehouse: [{ text: "cnblogs-theme-ecy", url: "http://www.gitee.com/cnblogs-theme-ecy" }],
          experience: [{ text: "基于 Vue3 的回收平台", date: "22.03.10" }],
          gossip: "抽到水神！",
          photo: {
            disabled: true,
            src: ["https://img2.baidu.com/it/u=803568479,1965819057&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281"]
          }
        }
      };
      initLocalSetting();
      dev();
    }

    $("head").append(`<link rel="shortcut icon" href="${__ECY_CONFIG__.icon}">`);
    EcyUtils.Log.primary("GitHub", "https://github.com/Himmelbleu/cnblogs-theme-ecy");
    EcyUtils.Log.primary("v1.1.0", "Powered By Himmelbleu using Vue3 & Vite.");
  }
}
