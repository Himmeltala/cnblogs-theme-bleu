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

  /**
   * 关闭 loading 屏
   */
  export function endLoading() {
    const loadingInst = document.querySelector<HTMLElement>(".loading");
    loadingInst.classList.toggle("fade-in-out");
    loadingInst.style.display = "none";

    document.getElementById("l-content").classList.toggle("fade-in-out");

    const eleTrack = document.querySelector("#l-progress > .track");
    eleTrack.classList.remove("track-active");
    eleTrack.classList.add("track-static");

    const eleBar = document.querySelector("#l-progress > .track > .bar");
    eleBar.classList.remove("bar-active");
    eleBar.classList.add("bar-static");
  }

  /**
   * 开启 loading 屏
   */
  export function startLoading() {
    document.getElementById("l-content").classList.toggle("fade-in-out");

    const eleTrack = document.querySelector("#l-progress > .track");
    eleTrack.classList.remove("track-static");
    eleTrack.classList.add("track-active");

    const eleBar = document.querySelector("#l-progress > .track > .bar");
    eleBar.classList.remove("bar-static");
    eleBar.classList.add("bar-active");
  }
}
