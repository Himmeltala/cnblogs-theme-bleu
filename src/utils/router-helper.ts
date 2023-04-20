/**
 * Vue Router 工具，解析 url，跳转对应的 router
 *
 * @author Himmelbleu
 * @date 2022 年 12 月 1 日
 */

import { useAnchorStore } from "@/store";

export enum RouterName {
  // 首页
  Index = "Index",
  // 铭牌
  Profile = "Profile",
  // 文章或随笔
  Works = "Works",
  // 一级和二级随笔或文章分类
  WorksBySort = "WorksBySort",
  // 随笔或文章档案
  WorksByArchive = "WorksByArchive",
  // 随笔或文章的标签
  WorksByMark = "WorksByMark",
  // 随笔或文章的日历
  WorksByCalendar = "WorksByCalendar",
  // 标签列表
  MarkList = "MarkList",
  // 相册
  Albumn = "Albumn",
  // 照片
  AlbumnItem = "AlbunItem"
}

export namespace RouterPath {
  /**
   * @returns "/"
   */
  export function index() {
    return "/";
  }

  /**
   * @returns "/profile"
   */
  export function profile() {
    return "/profile";
  }

  /**
   * @param id 随笔或文章 ID
   * @returns "/p/:id"
   */
  export function works(id?: string | number) {
    if (id) {
      return `/p/${id}`;
    } else return "/p/:id";
  }

  /**
   * @param tag 标签
   * @returns "/mark/:tag"
   */
  export function worksByMark(tag?: string) {
    if (tag) {
      return `/mark/${tag}`;
    } else return "/mark/:tag";
  }

  /**
   * @param mode a -> 文章分类；p -> 随笔分类
   * @param id 文章或随笔 ID
   * @returns "/sort/:mode/:id"
   */
  export function worksBySort(mode?: "a" | "p", id?: string | number) {
    if (mode && id) {
      return `/sort/${mode}/${id}`;
    } else return "/sort/:mode/:id";
  }

  /**
   *
   * @param mode a -> 文章；p -> 随笔；d -> 从日历点击过来的
   * @param date 日期
   * @returns "/archive/:mode/:date"
   */
  export function worksByArchive(mode?: "a" | "p" | "d", date?: string) {
    if (mode && date) {
      return `/archive/${mode}/${date}`;
    } else return "/archive/:mode/:date";
  }

  /**
   * @returns "/calendar"
   */
  export function worksByCalendar() {
    return "/calendar";
  }

  /**
   * @returns "/marks"
   */
  export function markList() {
    return "/marks";
  }

  /**
   * @param id 相册 ID
   * @returns "/albumn/:id"
   */
  export function albumn(id?: string | number) {
    if (id) {
      return `/albumn/${id}`;
    } else return "/albumn/:id";
  }

  /**
   * @param id 照片 ID
   * @returns "/albumn/item/:id"
   */
  export function albumnItem(id?: string | number) {
    if (id) {
      return `/albumn/item/${id}`;
    } else return "/album/item/:id";
  }
}

const regexp = {
  Works: /\/p\/\d+.html/g,
  WorksBySort: /\/category\/\d+/g,
  WorksByMark: /\/tag\/[\w\s\u4e00-\u9fa5\n.\-|_]+/g,
  Article: /\/articles\/\d+.html/g,
  AlbumnItem: /\/gallery\/image\/\d+/g
};

/**
 * 从评论链接点击进入时，获取其携带的评论锚点位置
 * @param URL 从评论点击过来的链接
 */
function setCommentAnchor(URL: string) {
  try {
    const anchor = URL.match(/#\/\d+/g)[0].split("#/")[1];
    if (anchor) {
      useAnchorStore().setAnchor(anchor);
    }
  } catch (e) {}
}

/**
 * 对原博客链接进行重写并提取重要信息。
 *
 * 比如文章页，地址是 https://www.cnblogs.com/Himmelbleu/p/11111.html。Vue Router 要的不是这样的 URL，而是 hash URL，
 * 提取该 URL 中重要信息，如随笔的 ID：11111，得到之后创建 guardNext，让 next 函数导入对应的路由组件。
 *
 * 如果进入的就是路由组件的 URL，则不需要进行上诉操作。
 *
 * @param next NavigationGuardNext
 * @returns 返回一个函数，在合适的时候执行，而非调用该函数就执行后续操作
 */
export function redirect(next: any): () => void {
  let nextParam: any;
  const URL = window.location.href;

  if (regexp.Works.test(URL)) {
    const postId = URL.match(regexp.Works)[0].split("/")[2].split(".")[0];
    setCommentAnchor(URL);
    nextParam = {
      name: RouterName.Works,
      params: { id: postId }
    };
  } else if (regexp.WorksBySort.test(URL)) {
    const sortId = URL.match(regexp.WorksBySort)[0].split("/")[2].split(",")[0];
    nextParam = {
      name: RouterName.WorksBySort,
      params: { id: sortId }
    };
  } else if (regexp.WorksByMark.test(URL)) {
    const tag = decodeURI(URL).match(regexp.WorksByMark)[0].split("/")[2];
    nextParam = {
      name: RouterName.WorksByMark,
      params: { tag }
    };
  } else if (regexp.AlbumnItem.test(URL)) {
    const id = URL.match(regexp.AlbumnItem)[0].split("/")[3];
    nextParam = {
      name: RouterName.AlbumnItem,
      params: { id }
    };
  } else if (regexp.Article.test(URL)) {
    const id = URL.match(regexp.Article)[0].split("/")[2].split(".")[0];
    console.log("article", id);
    nextParam = {
      name: RouterName.Works,
      params: { id }
    };
  }

  return function () {
    if (nextParam && Object.keys(nextParam).length > 0) {
      push();
      next(nextParam);
    } else {
      next();
    }
  };
}

function push() {
  window.history.pushState("", "", `${window.location.protocol}//${window.location.host}/${EcyConfig.blogApp}/#/`);
}
