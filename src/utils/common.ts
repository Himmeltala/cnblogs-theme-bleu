/**
 * 提供常用工具
 *
 * @author Himmelbleu
 * @date 2022 年 12 月 1 日
 */

import $ from "jquery";

export namespace EcyUtils {
  export function getLocalSetting() {
    return useStorage<CustType.ILocalSetting>(`l-${EcyConfig.blogApp}-setting`, getLocalSettingTemp());
  }

  export function getLocalSettingTemp(): CustType.ILocalSetting {
    return {
      theme: { mode: "dark" },
      toolkits: { pin: true },
      cabinet: {
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
    $(".light-loading, .dark-loading").fadeOut();
    $("#l-content").addClass("l-transition");
    $("#l-progress > .l-pro__track").removeClass("track-active").addClass("track-static");
    $("#l-progress > .l-pro__track > .l-pro__bar").removeClass("bar-active").addClass("bar-static");
  }

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

  export function setTitle(title?: string) {
    const prefix = title ? title + " - " : "";
    document.querySelector("title").innerText = `${prefix}${EcyConfig.blogApp} - 博客园`;
  }

  export namespace Random {
    function select(min: number, max: number) {
      let sum = max - min + 1;
      return Math.floor(Math.random() * sum + min);
    }

    export function get(src: string[], min = 0, max = src.length) {
      let a = [];
      if (src.length < max) {
        for (let i = 0; i < max; i++) {
          let d = Math.floor(Math.random() * src.length);
          a[i] = d;
        }
      } else {
        for (let i = 0; i < max; i++) {
          a[i] = select(min, max);
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
