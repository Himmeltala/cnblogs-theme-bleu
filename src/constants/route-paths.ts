export function home() {
  return "/";
}

/**
 * @returns "post/:id"
 */
export function post(id?: string | number) {
  return `/main/post/${id}`;
}

/**
 * @returns "label?name=C/C++"
 */
export function label(label?: string) {
  return `/main/label?name=${label}`;
}

/**
 * @returns "category?id=112233&page=1"
 */
export function category(id?: string | number | string[], page?: number | string) {
  return { path: "/main/category", query: { id, page: page || 1 } };
}

/**
 * @returns "posts?page=1"
 */
export function posts(page?: string | number) {
  return `/main/posts?page=${page || 1}`;
}

/**
 *
 * @param mode articles -> 文章；posts -> 随笔；d -> 从日历点击过来的
 * @param date 日期
 * @returns "archive/:mode/:date"
 */
export function archive(mode?: "articles" | "posts" | "d", date?: string) {
  return `/main/archive/${mode}/${date}`;
}

/**
 * @returns "labels"
 */
export function labels() {
  return "/main/labels";
}

/**
 * @returns "photos/:id"
 */
export function photos(id?: string | number) {
  return `/main/photos/${id}`;
}

/**
 * @returns "main/zone"
 */
export function zone() {
  return "/main/zone";
}
