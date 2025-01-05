import * as PathsModule from "./route-paths";

export namespace Consts {
  export const Paths: typeof PathsModule = PathsModule;

  /**
   * 博客设置选项
   */
  export let config: ConfigModel;

  /**
   * 获取博客 App
   *
   * @returns 比如：Himmeltala
   */
  export function getBlogApp() {
    if (import.meta.env.DEV) {
      return import.meta.env.VITE_BLOG_APP;
    } else {
      return currentBlogApp;
    }
  }

  /**
   * 获取博客 ID
   */
  export function getBlogId() {
    if (import.meta.env.DEV) {
      return import.meta.env.VITE_BLOG_ID;
    } else {
      return currentBlogId;
    }
  }

  /**
   * 获取博主自己的 blogUserGuid。在一些请求中需要使用该变量才能调用对应博客 API。
   */
  export function getUserGuid() {
    if (import.meta.env.DEV) {
      return import.meta.env.VITE_BLOG_GUID;
    } else {
      return visitorUserId;
    }
  }

  /**
   * 获取对方博主的 blogUserGuid。在一些请求中需要使用该变量才能调用对应博客 API。
   */
  export function getOppositeGuid() {
    const aInst = document.querySelector("#p_b_follow > a");
    if (aInst) {
      const attr = aInst.getAttribute("onclick");
      return attr?.split("(")[1]?.split(")")[0]?.replaceAll("'", "") ?? "";
    } else return "";
  }

  /**
   * 获取博客请求的基本 URL
   */
  export function getBaseURL() {
    if (import.meta.env.PROD) {
      return `https://www.cnblogs.com/${getBlogApp()}`;
    } else {
      return "/api";
    }
  }

  /**
   * 判断设备是否是 PC 端
   */
  export function isPC() {
    return !/iPhone|iPad|iPod|Android|IEMobile/.test(navigator.userAgent);
  }

  export const OPSTIONS_KEY = `l-${Consts.getBlogApp()}-setting`;
}
