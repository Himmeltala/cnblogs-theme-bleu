export function welcome() {
  return "/";
}

/**
 * @returns "/main/p/:id"
 */
export function p(id?: string | number) {
  return `/main/p/${id}`;
}

/**
 * @returns "/main/label?name=C/C++"
 */
export function label(label?: string) {
  return `/main/label?name=${label}`;
}

/**
 * @returns "/main/sort?id=112233&page=1"
 */
export function sort(id?: string | number | string[], page?: number | string) {
  return { path: "/main/sort", query: { id, page: page || "1" } };
}

/**
 * @returns "/main/posts?page=1"
 */
export function posts(page?: string | number) {
  return `/main/posts?page=${page}`;
}

/**
 *
 * @param mode a -> 文章；p -> 随笔；d -> 从日历点击过来的
 * @param date 日期
 * @returns "/archive/:mode/:date"
 */
export function archive(mode?: "a" | "p" | "d", date?: string) {
  return `/main/archive/${mode}/${date}`;
}

/**
 * @returns "/calendar"
 */
export function calendar() {
  return "/main/calendar";
}

/**
 * @returns "/labels"
 */
export function labels() {
  return "/main/labels";
}

/**
 * @returns "/albumn/:id"
 */
export function albumn(id?: string | number) {
  return `/main/albumn/${id}`;
}

/**
 * @returns "/albumn/item/:id"
 */
export function albumnitem(id?: string | number) {
  return `/main/albumn/item/${id}`;
}
