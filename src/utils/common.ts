/**
 * 提供常用工具
 *
 * @author Himmelbleu
 * @date 2022 年 12 月 1 日
 */

export namespace EcyUtils {
  export function getLocalSetting() {
    return useStorage<CustType.ILocalSetting>(`l-${EcyConfig.blogApp}-setting`, getLocalSettingTemp());
  }

  export function getLocalSettingTemp(): CustType.ILocalSetting {
    return {
      theme: { mode: "dark" },
      toolkits: { pin: true },
      menu: {
        toggles: {
          我的技术栈: { open: true, show: true },
          博客信息: { open: true, show: true },
          常用链接: { open: true, show: true },
          博客数据: { open: true, show: true },
          推荐书籍: { open: true, show: true }
        }
      }
    };
  }

  /**
   * 对一个对象的字段进行裁剪或添加
   *
   * @param source 要被裁剪或添加字段的对象
   * @param template 一个对象，根据该模板（对象）对 source 进行裁剪或添加字段
   */
  export function reloadObjProps(source: any, template: any) {
    if (!source) source = template;
    const sourceKeys = Object.keys(source);
    const templateKeys = Object.keys(template);

    if (sourceKeys.length !== templateKeys.length) {
      if (sourceKeys.length > templateKeys.length) {
        sourceKeys.forEach(sourceKey => {
          const nonentity = templateKeys.find(templateKey => templateKey === sourceKey);
          if (!nonentity) Reflect.deleteProperty(source, sourceKey);
        });
      } else if (sourceKeys.length < templateKeys.length) {
        templateKeys.forEach(templateKey => {
          const nonentity = sourceKeys.find(sourceKey => templateKey === sourceKey);
          if (!nonentity) source[templateKey] = template[templateKey];
          else {
            if (typeof template[templateKey] === "object") {
              reloadObjProps(source[templateKey], template[templateKey]);
            }
          }
        });
      }
    } else {
      templateKeys.forEach(templateKey => {
        if (typeof template[templateKey] === "object") {
          if (typeof source[templateKey] !== "object" || !source[templateKey]) {
            source[templateKey] = template[templateKey];
          }
          reloadObjProps(source[templateKey], template[templateKey]);
        } else if (typeof template[templateKey] !== "object") {
          if (typeof source[templateKey] === "object") source[templateKey] = template[templateKey];
        }
      });
    }
    return source;
  }

  export function endLoading() {
    const lightLoding = document.querySelector<HTMLElement>(".light-loading");
    const darkLoding = document.querySelector<HTMLElement>(".dark-loading");
    if (lightLoding) {
      lightLoding.classList.toggle("fade-in-out");
      lightLoding.style.display = "none";
    } else {
      darkLoding.classList.toggle("fade-in-out");
      darkLoding.style.display = "none";
    }

    document.getElementById("l-content").classList.toggle("fade-in-out");

    const eleTrack = document.querySelector("#l-progress > .track");
    eleTrack.classList.remove("track-active");
    eleTrack.classList.add("track-static");

    const eleBar = document.querySelector("#l-progress > .track > .bar");
    eleBar.classList.remove("bar-active");
    eleBar.classList.add("bar-static");
  }

  export function startLoading() {
    document.getElementById("l-content").classList.toggle("fade-in-out");

    const eleTrack = document.querySelector("#l-progress > .track");
    eleTrack.classList.remove("track-static");
    eleTrack.classList.add("track-active");

    const eleBar = document.querySelector("#l-progress > .track > .bar");
    eleBar.classList.remove("bar-static");
    eleBar.classList.add("bar-active");
  }

  function openWindow(w: string, t: number, i: number, r: number) {
    const left = (screen.width - t) / 2 - r;
    const top = (screen.height - i) / 2 - r;
    const hatch = window.open(w, "_blank", `width=${t},height=${i},toolbars=0,resizable=1,left=${left},top=${top}`);
    hatch.focus();
  }

  /**
   * 打开博客园上传图片的 API，上传完成之后，图片路径要回显到 textarea 上。
   *
   * @param el 图片上传成功之后返回的链接赋值给 textarea 元素。
   * @param onUploaded 选择符合规则的本地图片之后，小窗关闭返回一个图片连接到 el textarea 元素中，获取 focus 得到图片链接该回调函数可向上传递该链接。
   */
  export function openImageUploadWindow(el: string, onUploaded: (img: string) => void) {
    try {
      // @ts-ignore
      const elem = $(`#${el}`);

      elem.focus(() => {
        const imgUrl = elem.val() + "";
        onUploaded ? onUploaded(imgUrl.replace("[img]", "![](").replace("[/img]", ")")) : "";
        elem.val("");
      });

      const w = `${location.protocol}//upload.cnblogs${location.hostname.substring(
        location.hostname.lastIndexOf(".")
      )}/imageuploader/upload?host=www.cnblogs.com&editor=0#${el}`;

      document.domain = `cnblogs.${location.hostname.substring(location.hostname.lastIndexOf(".") + 1, location.hostname.length)}`;

      openWindow(w, 450, 120, 200);
    } catch (e) {
      console.error(e);
    }
  }

  export function setTitle(title?: string) {
    const prefix = title ? title + " - " : "";
    document.getElementsByTagName("title")[0].innerText = `${prefix}${EcyConfig.blogApp} - 博客园`;
  }

  export function scrollIntoView(selector: string) {
    document.querySelector(selector).scrollIntoView();
  }

  export namespace Random {
    function select(min: number, max: number) {
      let sum = max - min + 1;
      return Math.floor(Math.random() * sum + min);
    }

    export function get(src: string[], max: number) {
      let a = [];

      if (src.length < max) {
        for (let i = 0; i < max; i++) {
          let d = Math.floor(Math.random() * src.length);
          a[i] = d;
        }
      } else if (src.length >= max) {
        for (let i = 0; i < src.length; i++) {
          a[i] = select(0, src.length - 1);
          for (let z = 0; z < i; z++) {
            if (a[i] == a[z]) {
              i--;
              break;
            }
          }
        }
      }

      return a;
    }
  }

  export namespace Log {
    export function primary(title: string, msg: string) {
      console.log(
        `%c${title}%c${msg}`,
        "background: #409eff; color: #fff; border-radius: 3px 0 0 3px; padding: 10px",
        "margin-left: 10px;"
      );
    }

    export function warning(title: string, msg: string) {
      console.log(
        `%c${title}%c${msg}`,
        "background: #ea5d5e; color: #fff; border-radius: 3px 0 0 3px; padding: 10px",
        "margin-left: 10px;"
      );
    }
  }

  export namespace Parser {
    function fixed(trimed: string, suffix?: string, uint?: number, fix?: number) {
      const result = (Number(trimed) / uint || 1000).toFixed(fix || 2);
      return `${result}${suffix || ""}`;
    }

    /**
     * 把一串数字转换为“xx万”的形式
     *
     * @param num 被格式化的数字
     */
    export function unit(num: string): string {
      const trimed = num.trim();
      if (trimed.length < 5) {
        return fixed(trimed);
      } else if (trimed.length >= 5 && trimed.length <= 7) {
        return fixed(trimed, "万", 10000);
      }
    }
  }

  export namespace Text {
    /**
     * 替换字符串，默认替换 ""。传递 regExps，一个正则表达式数组。
     *
     * @param source 被修剪的字符串
     * @param regExps 正则表达式，找到匹配的字符串，然后替换掉
     * @param replacement 不传递，默认被替换的字符串是 ""。传递的数组等于 regExps 的长度，就一一对应进行替换。如果传递的
     * 数组小于 regExps，就与前几个进行对应替换，其余的用默认 "" 替换。
     */
    export function replace(source: string, regExps: RegExp[], replacement?: string[]) {
      let substitute = "";
      for (let i = 0; i < regExps.length; i++) {
        if (!replacement) substitute = "";
        else {
          if (!replacement[i]) substitute = "";
          else substitute = replacement[i];
        }
        source = source.replace(regExps[i], substitute);
      }
      return source;
    }

    /**
     * 循环分割字符串，得到最后结果
     *
     * @param str 源字符串
     * @param regex 从字符串中匹配想要的再进行切割
     * @param keys 对每一次 match 得到的子串进行索引，即取值
     * @param values 每一次 match 得到的子串
     * @returns 从 str 经过多次 split 得到的子串
     */
    export function split(str: string, regex: RegExp, keys: number[], values: string[]) {
      let matched;
      if (keys.length !== values.length) return "";
      if (str.match(regex)) {
        matched = str.match(regex)[0];
        for (let i = 0; i < keys.length; i++) {
          matched = matched.split(values[i])[keys[i]];
        }
      }
      return matched;
    }
  }

  export namespace Router {
    export function go(params: { path: string; router?: Router }) {
      if (params.path === "back") {
        params.router.go(-1);
      } else {
        if (params.router) params.router.push(params.path);
        else window.open(params.path, "_blank");
      }
    }
  }
}

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
    const eleA = document.querySelector("#p_b_follow > a");
    if (eleA) {
      const attr = eleA.getAttribute("onclick");
      return attr?.split("(")[1]?.split(")")[0]?.replaceAll("'", "") ?? "";
    } else return "";
  }

  /**
   * 初始化博客重要变量，这些变量不能通过 head script 获取，在一些元素属性上。
   */
  function getIsFollow() {
    const eleText = document.querySelector("#p_b_follow > a");
    if (eleText) {
      return eleText.innerText === "-取消关注" || false;
    } else return false;
  }

  function loadedEcy() {
    const setting = EcyUtils.getLocalSetting().value;
    const strings = JSON.stringify(EcyUtils.reloadObjProps(setting, EcyUtils.getLocalSettingTemp()));
    localStorage.setItem(`l-${blogApp}-setting`, strings);
    document.documentElement.setAttribute("class", setting.theme.mode);

    const fontFamily = __ECY_CONFIG__.font.main || `var(--el-font-family)`;
    document.querySelector("html").style.setProperty("--l-font-family", fontFamily);
  }

  function beforeUseEcy() {
    const eleApp = document.createElement("div");
    eleApp.setAttribute("id", "app");
    document.body.append(eleApp);
  }

  function afterUseEcy() {
    const eleIconLink = document.createElement("link");
    eleIconLink.rel = "shortcut icon";
    eleIconLink.href = __ECY_CONFIG__.icon;
    document.head.append(eleIconLink);
  }

  /**
   * 初始化 lite，所有工作准备完成之后，走回调函数，挂载 app。
   * @param dev 开发模式下直接挂载 app
   * @param pro 生产模式下，打包部署之后，给 window 注册一个函数，等待博客园资源加载完成之后再挂载 app。
   */
  export function useLite(dev: Function, pro: Function) {
    beforeUseEcy();

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
      loadedEcy();
      pro();
    } else if (import.meta.env.DEV) {
      blogId = import.meta.env.VITE_BLOG_ID;
      blogApp = import.meta.env.VITE_BLOG_APP;
      baseAPI = "/api";
      __ECY_CONFIG__ = {
        menu: {},
        covers: {
          matte: {
            index: 0.15,
            works: 0.1
          },
          filter: {
            index: "1.5px",
            works: "20px"
          },
          works: ["https://img1.baidu.com/it/u=726526983,4132763702&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500"],
          index: ["https://gzw.sinaimg.cn/large/0073YlnVgy1h8apu19t61j32yo1o0x6v.jpg"]
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
          code: "Hack",
          main: ""
        }
      };
      loadedEcy();
      dev();
    }

    afterUseEcy();
    EcyUtils.Log.primary("GitHub", "https://github.com/Himmelbleu/cnblogs-theme-ecy");
    EcyUtils.Log.primary("v1.3.0", "The Theme was Created By Himmelbleu, and Powered By Vue3 & Vite.");
  }
}
