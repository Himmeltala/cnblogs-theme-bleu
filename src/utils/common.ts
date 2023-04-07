/**
 * 提供常用工具
 *
 * @author Himmelbleu
 * @date 2022 年 12 月 1 日
 * @url https://www.cnblogs.com/Himmelbleu/#/
 */

import $ from "jquery";

export namespace EcyUtils {
  /**
   * 获取本地博客设置数据
   *
   * @returns 博客设置
   */
  export function getSetting() {
    return useStorage<CustType.ISetting>(`l-${EcyConfig.blogApp}-setting`, {});
  }

  /**
   * Ecy 主题设置模板对象
   */
  export function getSettingTemp(): CustType.ISetting {
    return {
      theme: { mode: "dark", color: "#409eff" },
      toolkits: { pin: true },
      pages: {
        home: {
          padding: { left: 1, right: 1, top: 1, bottom: 1 },
          margin: { left: 0, right: 0, top: 0, bottom: 1 }
        },
        writing: {
          code: { light: { color: "#f2f2f2" }, dark: { color: "#222222" } },
          padding: { left: 1, right: 1, top: 1, bottom: 1 },
          margin: { left: 0, right: 0, top: 0, bottom: 1 }
        },
        markList: {
          padding: { left: 0, right: 0, top: 0, bottom: 0 },
          margin: { left: 0, right: 0, top: 0, bottom: 0 }
        },
        markSort: {
          padding: { left: 1, right: 1, top: 1, bottom: 1 },
          margin: { left: 0, right: 0, top: 0, bottom: 1 }
        },
        gallery: {
          padding: { left: 1, right: 1, top: 1, bottom: 1 },
          margin: { left: 0, right: 0, top: 0, bottom: 0 }
        },
        sort: {
          padding: { left: 1, right: 1, top: 1, bottom: 1 },
          margin: { left: 0, right: 0, top: 0, bottom: 1 }
        }
      },
      font: {
        size: { level1: 1.3, level2: 1.2, level3: 1.1, level4: 1, level5: 0.9, level6: 0.8 },
        light: { color: { level1: "#393939", level2: "#4e4e4e", level3: "#707070" } },
        dark: { color: { level1: "#a7a7a7", level2: "#8d9095", level3: "#878787" } }
      },
      content: {
        width: 50,
        padding: { left: 0, right: 0, top: 0, bottom: 0 },
        margin: { left: 0, right: 0, top: 0, bottom: 0 }
      },
      cabinet: {
        position: { left: 0, right: 0, break: false },
        left: { pin: false, padding: { left: 1, right: 1, top: 1, bottom: 1 }, margin: { left: 0, right: 0, top: 0, bottom: 0 } },
        right: { pin: false, padding: { left: 1, right: 1, top: 1, bottom: 1 }, margin: { left: 0, right: 0, top: 0, bottom: 0 } },
        toggles: {
          我的技术栈: { open: true, show: true },
          博客信息: { open: true, show: true },
          常用链接: { open: true, show: true },
          博客数据: { open: true, show: true },
          推荐书籍: { open: true, show: true }
        },
        width: 17.5
      },
      background: { open: false, filter: 6, src: "" },
      card: {
        color: "rgba(31, 31, 31, 1)",
        open: false,
        radius: 10,
        padding: { left: 1, right: 1, top: 1, bottom: 1 },
        margin: { left: 0, right: 1, top: 0, bottom: 1 }
      },
      other: { github: { position: "left" }, pagation: { pin: true } }
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

  /**
   * 关闭 loading 屏
   */
  export function endLoading() {
    $(".light-loading, .dark-loading").fadeOut();
    $("#l-content").addClass("l-transition");
    $("#l-progress > .l-pro__track").removeClass("track-active").addClass("track-static");
    $("#l-progress > .l-pro__track > .l-pro__bar").removeClass("bar-active").addClass("bar-static");
  }

  /**
   * 开启 loading 屏
   */
  export function startLoading() {
    $("#l-content").removeClass("l-transition");
    $("#l-progress > .l-pro__track").removeClass("track-static").addClass("track-active");
    $("#l-progress > .l-pro__track > .l-pro__bar").removeClass("bar-static").addClass("bar-active");
  }

  /**
   * 打开博客园上传图片的窗口
   */
  function openWindow(w: string, t: number, i: number, r: number) {
    const left = (screen.width - t) / 2 - r;
    const top = (screen.height - i) / 2 - r;
    const hatch = window.open(w, "_blank", `width=${t},height=${i},toolbars=0,resizable=1,left=${left},top=${top}`);
    hatch!.focus();
  }

  /**
   * 打开博客园上传图片的 API，上传完成之后，图片路径要回显到 textarea 上。
   *
   * @param el 图片上传成功之后返回的链接赋值给 textarea 元素。
   * @param onUploaded 选择符合规则的本地图片之后，小窗关闭返回一个图片连接到 el textarea 元素中，获取 focus 得到图片链接该回调函数可向上传递该链接。
   */
  export function openImageUploadWindow(el: string, onUploaded: (img: string) => void) {
    try {
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

  export namespace Log {
    /**
     * 打印普通消息 log
     *
     * @param title 标题
     * @param msg 信息
     */
    export function primary(title: string, msg: string) {
      console.log(
        `%c${title}%c${msg}`,
        "background: #409eff; color: #fff; border-radius: 3px 0 0 3px; padding: 10px",
        "margin-left: 10px;"
      );
    }

    /**
     * 打印警告 log
     *
     * @param title 标题
     * @param msg 信息
     */
    export function warning(title: string, msg: string) {
      console.log(
        `%c${title}%c${msg}`,
        "background: #ea5d5e; color: #fff; border-radius: 3px 0 0 3px; padding: 10px",
        "margin-left: 10px;"
      );
    }
  }

  export namespace Parser {
    /**
     * 把一串数字转换为“xx万”的形式
     *
     * @param num 被格式化的数字
     */
    export function unit(num: string): string {
      num = num.trim();
      if (num.length < 5) {
        return (Number(num) / 1000).toFixed(2);
      } else if (num.length >= 5 && num.length <= 7) {
        return (Number(num) / 10000).toFixed(2) + "万";
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
  }

  export namespace Router {
    /**
     * 导航，传入 path 导航 Vue Router 路由组件；传入普通链接进行跳转；传入 back 对上级进行回跳。
     * @param params path：路径、router：导航路由组件时传递
     */
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
