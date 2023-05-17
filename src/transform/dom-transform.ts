/**
 * 把字符串转换为 DOM
 */
export function strToDOM(dom: string) {
  return new DOMParser().parseFromString(dom, "text/html");
}
