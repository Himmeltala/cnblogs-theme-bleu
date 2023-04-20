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
        cabinet: {},
        covers: {
          matte: {
            index: 0.15,
            works: 0.1
          },
          filter: {
            index: "1.5px",
            works: "20px"
          },
          works: [
            "https://img1.baidu.com/it/u=726526983,4132763702&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500",
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F3660fb05-8f3a-4c20-a290-bb9a7af75cb1%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1684687574&t=fa60842f83e2cf0842f13a22c38b7173"
          ],
          index: [
            "https://gzw.sinaimg.cn/large/0073YlnVgy1h8apu19t61j32yo1o0x6v.jpg",
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F3660fb05-8f3a-4c20-a290-bb9a7af75cb1%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1684687574&t=fa60842f83e2cf0842f13a22c38b7173"
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
          signature: "Time tick away, dream faded away!",
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
        },
        font: {
          family: `"Space Mono", Hack`
        }
      };
      initLocalSetting();
      dev();
    }

    $("head").append(`<link rel="shortcut icon" href="${__ECY_CONFIG__.icon}">`);
    EcyUtils.Log.primary("GitHub", "https://github.com/Himmelbleu/cnblogs-theme-ecy");
    EcyUtils.Log.primary("v1.2.0", "Powered By Himmelbleu using Vue3 & Vite.");
  }
}
