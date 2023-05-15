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
    name: RouterName.INDEX,
    path: RouterPath.INDEX(),
    component: () => import("@/views/index.vue"),
    meta: { title: "首页" }
  },
  {
    name: RouterName.PROFILE,
    path: RouterPath.PROFILE(),
    component: () => import("@/views/profile.vue"),
    meta: { title: "我的铭牌" }
  },
  {
    name: RouterName.WORKS,
    path: RouterPath.WORKS(),
    component: () => import("@/views/works.vue")
  },
  {
    name: RouterName.WORKS_BY_MARK,
    path: RouterPath.WORKS_BY_MARK(),
    component: () => import("@/views/works-by-mark.vue")
  },
  {
    name: RouterName.WORKS_BY_SORT,
    path: RouterPath.WORKS_BY_SORT(),
    component: () => import("@/views/works-by-sort.vue")
  },
  {
    name: RouterName.WORKS_BY_ARCHIVE,
    path: RouterPath.WORKS_BY_ARCHIVE(),
    component: () => import("@/views/works-by-archive.vue")
  },
  {
    name: RouterName.WORKS_BY_CALENDAR,
    path: RouterPath.WORKS_BY_CALENDAR(),
    component: () => import("@/views/works-by-calendar.vue"),
    meta: { title: "博客日历" }
  },
  {
    name: RouterName.MARK_LIST,
    path: RouterPath.MARK_LIST(),
    component: () => import("@/views/mark-list.vue"),
    meta: { title: "标签集合" }
  },
  {
    name: RouterName.ALBUMN,
    path: RouterPath.ALBUMN(),
    component: () => import("@/views/albumn.vue"),
    meta: { title: "相册" }
  },
  {
    name: RouterName.ALBUMN_ITEM,
    path: RouterPath.ALBUMN_ITEM(),
    component: () => import("@/views/albumn-item.vue"),
    meta: { title: "相册图片" }
  }
];

/**
 * 针对于博客园的路由匹配规则
 */
const routeRules = [
  {
    regex: RouterRegx.WORKS,
    name: RouterName.WORKS,
    params: { id: EcyUtils.Text.split(window.location.href, RouterRegx.WORKS, [2, 0], ["/", "."]) },
    before: indexesWorksComment
  },
  {
    regex: RouterRegx.WORKS_BY_SORT,
    name: RouterName.WORKS_BY_SORT,
    params: { id: EcyUtils.Text.split(window.location.href, RouterRegx.WORKS_BY_SORT, [2, 0], ["/", "."]) }
  },
  {
    regex: RouterRegx.WORKS_BY_MARK,
    name: RouterName.WORKS_BY_MARK,
    params: { tag: EcyUtils.Text.split(decodeURI(window.location.href), RouterRegx.WORKS_BY_MARK, [2], ["/"]) }
  },
  {
    regex: RouterRegx.ALBUMN_ITEM,
    name: RouterName.ALBUMN_ITEM,
    params: { id: EcyUtils.Text.split(window.location.href, RouterRegx.ALBUMN_ITEM, [3], ["/"]) }
  },
  {
    regex: RouterRegx.ARTICLES,
    name: RouterName.WORKS,
    params: { id: EcyUtils.Text.split(window.location.href, RouterRegx.ARTICLES, [2, 0], ["/", "."]) }
  }
];

function indexesWorksComment() {
  const result = /#\/\d+/g.exec(window.location.href);
  if (result !== null) {
    const anchor = result[0].split("#/")[1];
    useAnchorStore().setAnchor(anchor);
  }
}

/**
 * 对原博客链接进行重写并提取重要信息。
 *
 * 比如，https://www.cnblogs.com/Himmelbleu/p/11111.html。要对该地址进行转换，得到一个 Vue Router 认识的 hash URL，
 * 需要该地址中 11111，即作品的 ID，通过 blogRoutingRules 博客园路由匹配规则获取。
 */
export function redirect(next: NavigationGuardNext) {
  const matched = routeRules.find(router => router.regex.test(window.location.href));

  if (matched) {
    if (matched.before) matched.before();
    window.history.pushState("", "", `${window.location.protocol}//${window.location.host}/${EcyConfig.blogApp}/#/`);
    next({
      name: matched.name,
      params: matched.params
    });
  } else next();
}
