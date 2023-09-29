/**
 * Vue Router 工具，解析 url，跳转对应的 router
 *
 * @author Himmelbleu
 * @date 2022 年 12 月 1 日
 */
import { useAnchorStore } from "@/store";
import type { RouteRecordRaw, NavigationGuardNext } from "vue-router";

export const routes = <RouteRecordRaw[]>[
  {
    name: RouterName.PostsList,
    path: RouterPath.PostsList(),
    component: () => import("@/views/PostList.vue"),
    meta: { title: "随笔列表" }
  },
  {
    name: RouterName.PostDetail,
    path: RouterPath.PostDetail(),
    component: () => import("@/views/PostDetail.vue")
  },
  {
    name: RouterName.PostsByMark,
    path: RouterPath.PostsByMark(),
    props: true,
    component: () => import("@/views/PostsByMark.vue")
  },
  {
    name: RouterName.PostsBySort,
    path: RouterPath.PostsBySort(),
    props: true,
    component: () => import("@/views/PostsBySort.vue")
  },
  {
    name: RouterName.PostsByArchive,
    path: RouterPath.PostsByArchive(),
    component: () => import("@/views/PostsByArchive.vue")
  },
  {
    name: RouterName.PostsByCalendar,
    path: RouterPath.PostsByCalendar(),
    component: () => import("@/views/PostsByCalendar.vue"),
    meta: { title: "博客日历" }
  },
  {
    name: RouterName.MarkList,
    path: RouterPath.MarkList(),
    component: () => import("@/views/MarkList.vue"),
    meta: { title: "所有标签" }
  },
  {
    name: RouterName.Albumn,
    path: RouterPath.Albumn(),
    component: () => import("@/views/Albumn.vue"),
    meta: { title: "相册" }
  },
  {
    name: RouterName.AlbumnItem,
    path: RouterPath.AlbumnItem(),
    component: () => import("@/views/AlbumnItem.vue"),
    meta: { title: "相册图片" }
  }
];

function positionToComment() {
  const result = /#\/\d+/g.exec(window.location.href);
  if (result !== null) {
    const anchor = result[0].split("#/")[1];
    useAnchorStore().setAnchor(anchor);
  }
}

/**
 * 针对于博客园的路由匹配规则
 */
const routeRules = [
  {
    regex: RouterRegx.PostDetail,
    name: RouterName.PostDetail,
    params: {
      id: Textual.regexSplit(window.location.href, RouterRegx.PostDetail, [2, 0], ["/", "."])
    },
    before: positionToComment
  },
  {
    regex: RouterRegx.PostsBySort,
    name: RouterName.PostsBySort,
    params: {
      id: Textual.regexSplit(window.location.href, RouterRegx.PostsBySort, [2, 0], ["/", "."])
    }
  },
  {
    regex: RouterRegx.PostsByMark,
    name: RouterName.PostsByMark,
    params: {
      tag: Textual.regexSplit(decodeURI(window.location.href), RouterRegx.PostsByMark, [2], ["/"])
    }
  },
  {
    regex: RouterRegx.AlbumnItem,
    name: RouterName.AlbumnItem,
    params: { id: Textual.regexSplit(window.location.href, RouterRegx.AlbumnItem, [3], ["/"]) }
  },
  {
    regex: RouterRegx.Articles,
    name: RouterName.PostDetail,
    params: {
      id: Textual.regexSplit(window.location.href, RouterRegx.Articles, [2, 0], ["/", "."])
    }
  }
];

/**
 * 对原博客链接进行重写并提取重要信息。
 */
export function redirect(next: NavigationGuardNext) {
  const matched = routeRules.find(rule => rule.regex.test(window.location.href));

  if (matched) {
    matched.before && matched.before();
    window.history.pushState(
      "",
      "",
      `${window.location.protocol}//${window.location.host}/${BleuVars.getBlogApp()}/#/`
    );
    next({
      name: matched.name,
      params: matched.params
    });
  } else next();
}
