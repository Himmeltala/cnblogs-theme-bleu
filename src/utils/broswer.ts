/**
 * 操作浏览器
 *
 * @author Himmelbleu
 * @date 2023 年 1 月 15 日
 */
export namespace Broswer {
  /**
   * 设置标题
   *
   * @param title 标题内容
   */
  export function setTitle(title?: string) {
    const prefix = title ? title + " - " : "";
    document.getElementsByTagName(
      "title"
    )[0].innerText = `${prefix}${BleuVars.getBlogApp()} - 博客园`;
  }

  /**
   * 移动窗口
   *
   * @param selector 选择器
   */
  export function scrollIntoView(selector: string) {
    document.querySelector(selector).scrollIntoView();
  }

  export class Loading {
    trackInst: HTMLElement;
    barInst: HTMLElement;

    constructor() {
      this.trackInst = document.querySelector<HTMLElement>("#l-progress > .track");
      this.barInst = document.querySelector<HTMLElement>("#l-progress > .track > .bar");
    }

    /**
     * 关闭 loading 屏
     */
    endLoading() {
      this.trackInst.classList.remove("track-active");
      this.trackInst.classList.add("track-static");

      this.barInst.classList.remove("bar-active");
      this.barInst.classList.add("bar-static");

      const loadingInst = document.querySelector<HTMLElement>(".loading");
      loadingInst.classList.toggle("fade-in-out");
      loadingInst.style.display = "none";

      document.getElementById("l-content").classList.toggle("fade-in-out");
    }

    /**
     * 开启 loading 屏
     */
    startLoading() {
      this.trackInst.classList.remove("track-static");
      this.trackInst.classList.add("track-active");
      this.barInst.classList.remove("bar-static");
      this.barInst.classList.add("bar-active");

      document.getElementById("l-content").classList.toggle("fade-in-out");
    }
  }
}
