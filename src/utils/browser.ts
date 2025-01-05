/**
 * 操作浏览器
 *
 * @author Himmeltala
 * @date 2023 年 1 月 15 日
 */

/**
 * 设置标题
 *
 * @param title 标题内容
 */
export function setTitle(title?: string) {
  const prefix = title ? title + " - " : "";
  document.getElementsByTagName("title")[0].innerText = `${prefix}${Consts.getBlogApp()} - 博客园`;
}

/**
 * 通过 href 获取样式表
 *
 * @param href
 * @returns
 */
export function getStyleSheetByHref(href: string): CSSStyleSheet {
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href && document.styleSheets[i].href.includes(href)) {
      return document.styleSheets[i];
    }
  }
  return null;
}

/**
 * 通过 title 获取样式表
 *
 * @param title
 * @returns
 */
export function getStyleSheetByTitle(title: string): CSSStyleSheet {
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].title === title) {
      return document.styleSheets[i];
    }
  }
  return null;
}

export function startLoading() {
  const loadingInst = document.querySelector<HTMLElement>(".loading");
  const trackEl = document.querySelector<HTMLElement>("#l-progress > .track");
  const barEl = document.querySelector<HTMLElement>("#l-progress > .track > .bar");

  loadingInst.style.display = "block";
  trackEl.classList.remove("track-static");
  trackEl.classList.add("track-active");
  barEl.classList.remove("bar-static");
  barEl.classList.add("bar-active");

  document.getElementById("l-content").classList.toggle("fade-in-out");
}

export function endLoading() {
  const loadingInst = document.querySelector<HTMLElement>(".loading");
  const trackEl = document.querySelector<HTMLElement>("#l-progress > .track");
  const barEl = document.querySelector<HTMLElement>("#l-progress > .track > .bar");

  loadingInst.style.display = "none";
  trackEl.classList.remove("track-active");
  trackEl.classList.add("track-static");
  barEl.classList.remove("bar-active");
  barEl.classList.add("bar-static");

  document.getElementById("l-content").classList.toggle("fade-in-out");
}
