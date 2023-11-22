/**
 * @param id 随笔或文章 ID
 * @returns "/p/:id"
 */
export function PostDetail(id?: string | number) {
  if (id) {
    return `/p/${id}`;
  } else return "/p/:id";
}

/**
 * @param label 标签
 * @returns "/label" 或者 "/label?name=C/C++"
 */
export function PostsByLabel(label?: string) {
  if (label) {
    return `/label?name=${label}`;
  } else return "/label";
}

/**
 * @param id 文章或随笔 ID
 * @returns "/sort?id=112233&page=1" 或者 "/sort"
 */
export function PostsBySort(id?: string | number | string[], page?: number | string) {
  if (id) {
    return { path: "/sort", query: { id, page: page || "1" } };
  } else return "/sort";
}

/**
 * @param page 文章列表
 * @returns "/" 或者 "/?page=1"
 */
export function PostsList(page?: string | number) {
  if (page) {
    return `/?page=${page}`;
  } else return "/";
}

/**
 *
 * @param mode a -> 文章；p -> 随笔；d -> 从日历点击过来的
 * @param date 日期
 * @returns "/archive/:mode/:date"
 */
export function PostsByArchive(mode?: "a" | "p" | "d", date?: string) {
  if (mode && date) {
    return `/archive/${mode}/${date}`;
  } else return "/archive/:mode/:date";
}

/**
 * @returns "/calendar"
 */
export function PostsByCalendar() {
  return "/calendar";
}

/**
 * @returns "/labels"
 */
export function LabelList() {
  return "/labels";
}

/**
 * @param id 相册 ID
 * @returns "/albumn/:id"
 */
export function Albumn(id?: string | number) {
  if (id) {
    return `/albumn/${id}`;
  } else return "/albumn/:id";
}

/**
 * @param id 照片 ID
 * @returns "/albumn/item/:id"
 */
export function AlbumnItem(id?: string | number) {
  if (id) {
    return `/albumn/item/${id}`;
  } else return "/album/item/:id";
}
