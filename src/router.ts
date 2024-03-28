import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw, NavigationGuardNext } from "vue-router";
import { useAnchorStore } from "@/store";

const routes = <RouteRecordRaw[]>[
  {
    name: "Index",
    path: "/",
    component: () => import("@/AppIndex.vue"),
    meta: { title: "首页" }
  },
  {
    name: "Main",
    path: "/main",
    redirect: "/main/posts",
    component: () => import("@/AppMain.vue"),
    meta: { title: "主页" },
    children: [
      {
        name: "Posts",
        path: "posts",
        component: () => import("@/views/Posts.vue"),
        meta: { title: "随笔列表" }
      },
      {
        name: "PostDetail",
        path: "p/:id",
        component: () => import("@/views/PostDetail.vue")
      },
      {
        name: "PostsByLabel",
        path: "label",
        component: () => import("@/views/PostsByLabel.vue")
      },
      {
        name: "PostsBySort",
        path: "sort",
        component: () => import("@/views/PostsBySort.vue")
      },
      {
        name: "PostsByArchive",
        path: "archive/:mode/:date",
        component: () => import("@/views/PostsByArchive.vue")
      },
      {
        name: "PostsByCalendar",
        path: "calendar",
        component: () => import("@/views/PostsByCalendar.vue"),
        meta: { title: "日历" }
      },
      {
        name: "LabelList",
        path: "labels",
        component: () => import("@/views/LabelList.vue"),
        meta: { title: "标签" }
      },
      {
        name: "Albumn",
        path: "albumn/:id",
        component: () => import("@/views/Albumn.vue"),
        meta: { title: "相册" }
      },
      {
        name: "AlbumnItem",
        path: "album/item/:id",
        component: () => import("@/views/AlbumnItem.vue"),
        meta: { title: "相册图片" }
      }
    ]
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
    Utils.Browser.setTitle(`${to.meta.title}`);
  }
});

export default router;
