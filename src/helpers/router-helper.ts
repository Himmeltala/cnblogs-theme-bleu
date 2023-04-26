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
 * 针对于博客园的路由匹配规则
 */
const blogRoutingRules = [
  {
    regex: RouterRegx.WORKS,
    name: RouterName.WORKS,
    params: { id: EcyUtils.Text.split(window.location.href, RouterRegx.WORKS, [2, 0], ["/", "."]) },
    before: addWorksAnchors
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

/**
 * 从评论链接点击进入时，获取其携带的评论锚点位置
 */
function addWorksAnchors(URL: string) {
  const result = /#\/\d+/g.exec(URL);
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
 * 比如，https://www.cnblogs.com/Himmelbleu/p/11111.html。要对该地址进行转换，得到一个 Vue Router 认识的 hash URL，
 * 需要该地址中 11111，即作品的 ID，通过 blogRoutingRules 博客园路由匹配规则获取。
 *
 * @param next NavigationGuardNext
 */
export function redirect(next: NavigationGuardNext) {
  const matched = blogRoutingRules.find(router => router.regex.test(window.location.href));

  if (matched) {
    matched.before && matched.before(window.location.href);
    push();
    next({
      name: matched.name,
      params: matched.params
    });
  } else next();
}
