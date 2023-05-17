export namespace BleuVars {
  export let config: BleuConfig;

  export function getBlogApp() {
    if (import.meta.env.DEV) {
      return import.meta.env.VITE_BLOG_APP;
    } else {
      return currentBlogApp;
    }
  }

  export function getBlogId() {
    if (import.meta.env.DEV) {
      return import.meta.env.VITE_BLOG_ID;
    } else {
      return currentBlogId;
    }
  }

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
  export function getUserGuid() {
    const eleA = document.querySelector("#p_b_follow > a");
    if (eleA) {
      const attr = eleA.getAttribute("onclick");
      return attr?.split("(")[1]?.split(")")[0]?.replaceAll("'", "") ?? "";
    } else return "";
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
