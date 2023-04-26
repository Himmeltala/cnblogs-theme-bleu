export enum ProvideKey {
  CATALOG_DISABLED = "catalogDisabled"
}

export enum RouterName {
  INDEX = "Index",
  PROFILE = "Profile",
  WORKS = "Works",
  WORKS_BY_SORT = "WorksBySort",
  WORKS_BY_ARCHIVE = "WorksByArchive",
  WORKS_BY_MARK = "WorksByMark",
  WORKS_BY_CALENDAR = "WorksByCalendar",
  MARK_LIST = "MarkList",
  ALBUMN = "Albumn",
  ALBUMN_ITEM = "AlbunItem"
}

export namespace RouterPath {
  /**
   * @returns "/"
   */
  export function INDEX() {
    return "/";
  }

  /**
   * @returns "/profile"
   */
  export function PROFILE() {
    return "/profile";
  }

  /**
   * @param id 随笔或文章 ID
   * @returns "/p/:id"
   */
  export function WORKS(id?: string | number) {
    if (id) {
      return `/p/${id}`;
    } else return "/p/:id";
  }

  /**
   * @param tag 标签
   * @returns "/mark/:tag"
   */
  export function WORKS_BY_MARK(tag?: string) {
    if (tag) {
      return `/mark/${tag}`;
    } else return "/mark/:tag";
  }

  /**
   * @param id 文章或随笔 ID
   * @returns "/sort/:id"
   */
  export function WORKS_BY_SORT(id?: string | number) {
    if (id) {
      return `/sort/${id}`;
    } else return "/sort/:id";
  }

  /**
   *
   * @param mode a -> 文章；p -> 随笔；d -> 从日历点击过来的
   * @param date 日期
   * @returns "/archive/:mode/:date"
   */
  export function WORKS_BY_ARCHIVE(mode?: "a" | "p" | "d", date?: string) {
    if (mode && date) {
      return `/archive/${mode}/${date}`;
    } else return "/archive/:mode/:date";
  }

  /**
   * @returns "/calendar"
   */
  export function WORKS_BY_CALENDAR() {
    return "/calendar";
  }

  /**
   * @returns "/marks"
   */
  export function MARK_LIST() {
    return "/marks";
  }

  /**
   * @param id 相册 ID
   * @returns "/albumn/:id"
   */
  export function ALBUMN(id?: string | number) {
    if (id) {
      return `/albumn/${id}`;
    } else return "/albumn/:id";
  }

  /**
   * @param id 照片 ID
   * @returns "/albumn/item/:id"
   */
  export function ALBUMN_ITEM(id?: string | number) {
    if (id) {
      return `/albumn/item/${id}`;
    } else return "/album/item/:id";
  }
}

export namespace RouterRegx {
  export const WORKS = /\/p\/\d+.html/g;
  export const WORKS_BY_SORT = /\/category\/\d+/g;
  export const WORKS_BY_MARK = /\/tag\/[\w\s\u4e00-\u9fa5\n\-\_%]+/g;
  export const ARTICLES = /\/articles\/\d+.html/g;
  export const ALBUMN_ITEM = /\/gallery\/image\/\d+/g;
}
