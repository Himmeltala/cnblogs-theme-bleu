import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw, NavigationGuardNext } from "vue-router";
import { useAnchorStore } from "@/store";

const routes = <RouteRecordRaw[]>[
  {
    name: "PostsList",
    path: RoutePaths.PostsList(),
    component: () => import("@/views/PostList.vue"),
    meta: { title: "随笔列表" }
  },
  {
    name: "PostDetail",
    path: RoutePaths.PostDetail(),
    component: () => import("@/views/PostDetail.vue")
  },
  {
    name: "PostsByLabel",
    path: RoutePaths.PostsByLabel(),
    component: () => import("@/views/PostsByLabel.vue")
  },
  {
    name: "PostsBySort",
    path: RoutePaths.PostsBySort(),
    component: () => import("@/views/PostsBySort.vue")
  },
  {
    name: "PostsByArchive",
    path: RoutePaths.PostsByArchive(),
    component: () => import("@/views/PostsByArchive.vue")
  },
  {
    name: "PostsByCalendar",
    path: RoutePaths.PostsByCalendar(),
    component: () => import("@/views/PostsByCalendar.vue"),
    meta: { title: "日历" }
  },
  {
    name: "LabelList",
    path: RoutePaths.LabelList(),
    component: () => import("@/views/LabelList.vue"),
    meta: { title: "标签" }
  },
  {
    name: "Albumn",
    path: RoutePaths.Albumn(),
    component: () => import("@/views/Albumn.vue"),
    meta: { title: "相册" }
  },
  {
    name: "AlbumnItem",
    path: RoutePaths.AlbumnItem(),
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
const RouteRules = [
  {
    regex: new RegExp("/" + Consts.getBlogApp() + "/p/\\d{8}", "g"),
    name: "PostDetail",
    params: {
      id: Utils.Textual.split(
        window.location.href,
        new RegExp("/" + Consts.getBlogApp() + "/p/\\d{8}", "g"),
        [3],
        ["/"]
      )
    },
    before: positionToComment
  },
  {
    regex: /\/category\/\d+/g,
    name: "PostsBySort",
    params: {
      id: Utils.Textual.split(window.location.href, /\/category\/\d+/g, [2, 0], ["/", "."])
    }
  },
  {
    regex: /\/tag\/[\w\s\u4e00-\u9fa5\n\-\_%]+/g,
    name: "PostsByLabel",
    params: {
      tag: Utils.Textual.split(
        decodeURI(window.location.href),
        /\/tag\/[\w\s\u4e00-\u9fa5\n\-\_%]+/g,
        [2],
        ["/"]
      )
    }
  },
  {
    regex: /\/gallery\/image\/\d+/g,
    name: "AlbumnItem",
    params: { id: Utils.Textual.split(window.location.href, /\/gallery\/image\/\d+/g, [3], ["/"]) }
  },
  {
    regex: /\/articles\/\d+.html/g,
    name: "PostDetail",
    params: {
      id: Utils.Textual.split(window.location.href, /\/articles\/\d+.html/g, [2, 0], ["/", "."])
    }
  }
];

/**
 * 对原博客链接进行重写并提取重要信息。
 */
function redirect(next: NavigationGuardNext) {
  const matched = RouteRules.find(rule => rule.regex.test(window.location.href));

  if (matched) {
    matched.before && matched.before();
    window.history.pushState(
      "",
      "",
      `${window.location.protocol}//${window.location.host}/${Consts.getBlogApp()}/#/`
    );
    next({
      name: matched.name,
      params: matched.params
    });
  } else next();
}

const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { el: "#app", top: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  redirect(next);
});

router.afterEach(to => {
  if (to.meta.title) {
    Utils.Broswer.setTitle(`${to.meta.title}`);
  }
});

export default router;
