/**
 * 字符串转换为 Document 对象
 */
export function toDOM(dom: string) {
  return new DOMParser().parseFromString(dom, "text/html");
}
