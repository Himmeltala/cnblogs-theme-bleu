export namespace BleuVars {
  /**
   * 博客设置选项
   */
  export let config: BleuConfig;

  /**
   * 获取博客 App
   *
   * @returns 比如：Himmelbleu
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
  export function getBlogGuid() {
    if (import.meta.env.DEV) {
      return import.meta.env.VITE_BLOG_GUID;
    } else return visitorUserId;
  }

  /**
   * 获取对方博主的 blogUserGuid。在一些请求中需要使用该变量才能调用对应博客 API。
   */
  export function getOppositeGuid() {
    const eleA = document.querySelector("#p_b_follow > a");
    if (eleA) {
      const attr = eleA.getAttribute("onclick");
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
  export function isPcDevice() {
    return !/iPhone|iPad|iPod|Android|IEMobile/.test(navigator.userAgent);
  }

  /**
   * 初始化博客重要变量，这些变量不能通过 head script 获取，在一些元素属性上。
   */
  export function isFollow() {
    const eleText = document.querySelector("#p_b_follow > a");
    if (eleText) {
      return eleText.innerText === "-取消关注" || false;
    } else return false;
  }
}
