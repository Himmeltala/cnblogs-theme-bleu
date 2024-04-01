import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw, NavigationGuardNext } from "vue-router";
import { useAnchorStore } from "@/store";

const routes = <RouteRecordRaw[]>[
  {
    name: "Index",
    path: "/",
    meta: { title: "首页" },
    component: () => import("@/views/Index.vue")
  },
  {
    name: "Main",
    path: "/main",
    redirect: "/main/posts",
    component: () => import("@/layouts/Main.vue"),
    children: [
      {
        name: "Posts",
        path: "posts",
        meta: { title: "随笔" },
        component: () => import("@/views/Posts.vue")
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
        meta: { title: "日历" },
        component: () => import("@/views/PostsByCalendar.vue")
      },
      {
        name: "LabelList",
        path: "labels",
        meta: { title: "标签" },
        component: () => import("@/views/LabelList.vue")
      },
      {
        name: "Albumn",
        path: "albumn/:id",
        meta: { title: "相册" },
        component: () => import("@/views/Albumn.vue")
      },
      {
        name: "AlbumnItem",
        path: "album/item/:id",
        meta: { title: "相册图片" },
        component: () => import("@/views/AlbumnItem.vue")
      }
    ]
  }
];

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
    before: () => {
      const result = /#\/\d+/g.exec(window.location.href);
      if (result !== null) {
        const anchor = result[0].split("#/")[1];
        useAnchorStore().setAnchor(anchor);
      }
    }
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
