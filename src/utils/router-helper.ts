/**
 * Vue Router 工具，解析 url，跳转对应的 router
 *
 * @author Himmelbleu
 * @date 2022 年 12 月 1 日
 */

import { useAnchorStore } from "@/store";

export const routes = [
  {
    name: RouterName.INDEX,
    path: RouterPath.INDEX(),
    component: () => import("@/views/Index.vue")
  },
  {
    name: RouterName.PROFILE,
    path: RouterPath.PROFILE(),
    component: () => import("@/views/Profile.vue")
  },
  {
    name: RouterName.WORKS,
    path: RouterPath.WORKS(),
    component: () => import("@/views/Works.vue")
  },
  {
    name: RouterName.WORKS_BY_MARK,
    path: RouterPath.WORKS_BY_MARK(),
    component: () => import("@/views/WorksByMark.vue")
  },
  {
    name: RouterName.WORKS_BY_SORT,
    path: RouterPath.WORKS_BY_SORT(),
    component: () => import("@/views/WorksBySort.vue")
  },
  {
    name: RouterName.WORKS_BY_ARCHIVE,
    path: RouterPath.WORKS_BY_ARCHIVE(),
    component: () => import("@/views/WorksByArchive.vue")
  },
  {
    name: RouterName.WORKS_BY_CALENDAR,
    path: RouterPath.WORKS_BY_CALENDAR(),
    component: () => import("@/views/WorksByCalendar.vue")
  },
  {
    name: RouterName.MARK_LIST,
    path: RouterPath.MARK_LIST(),
    component: () => import("@/views/MarkList.vue")
  },
  {
    name: RouterName.ALBUMN,
    path: RouterPath.ALBUMN(),
    component: () => import("@/views/Albumn.vue")
  },
  {
    name: RouterName.ALBUMN_ITEM,
    path: RouterPath.ALBUMN_ITEM(),
    component: () => import("@/views/AlbumnItem.vue")
  }
];

/**
 * 从评论链接点击进入时，获取其携带的评论锚点位置
 * @param URL 从评论点击过来的链接
 */
function addCommentAnchor(URL: string) {
  const regex = /#\/\d+/g;
  const result = regex.exec(URL);
  if (result !== null) {
    const anchor = result[0].split("#/")[1];
    useAnchorStore().setAnchor(anchor);
  }
}

function push() {
  window.history.pushState("", "", `${window.location.protocol}//${window.location.host}/${EcyConfig.blogApp}/#/`);
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

  if (RouterRegx.WORKS.test(URL)) {
    const postId = URL.match(RouterRegx.WORKS)[0].split("/")[2].split(".")[0];
    addCommentAnchor(URL);
    nextParam = {
      name: RouterName.WORKS,
      params: { id: postId }
    };
  } else if (RouterRegx.WORKS_BY_SORT.test(URL)) {
    const sortId = URL.match(RouterRegx.WORKS_BY_SORT)[0].split("/")[2].split(",")[0];
    nextParam = {
      name: RouterName.WORKS_BY_SORT,
      params: { id: sortId }
    };
  } else if (RouterRegx.WORKS_BY_MARK.test(URL)) {
    const tag = decodeURI(URL).match(RouterRegx.WORKS_BY_MARK)[0].split("/")[2];
    nextParam = {
      name: RouterName.WORKS_BY_MARK,
      params: { tag }
    };
  } else if (RouterRegx.ALBUMN_ITEM.test(URL)) {
    const id = URL.match(RouterRegx.ALBUMN_ITEM)[0].split("/")[3];
    nextParam = {
      name: RouterName.ALBUMN_ITEM,
      params: { id }
    };
  } else if (RouterRegx.ARTICLES.test(URL)) {
    const id = URL.match(RouterRegx.ARTICLES)[0].split("/")[2].split(".")[0];
    nextParam = {
      name: RouterName.WORKS,
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
