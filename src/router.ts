import type { NavigationGuardNext, RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import { useAnchorStore } from "@/store";

const routes = <RouteRecordRaw[]>[
  {
    name: "Home",
    path: "/",
    meta: { title: "首页" },
    component: () => import("@/views/Home.vue")
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
        path: "post/:id",
        component: () => import("@/views/PostDetail.vue")
      },
      {
        name: "Label",
        path: "label",
        component: () => import("@/views/Label.vue")
      },
      {
        name: "Category",
        path: "category",
        component: () => import("@/views/Category.vue")
      },
      {
        name: "Archive",
        path: "archive/:mode/:date",
        component: () => import("@/views/Archive.vue")
      },
      {
        name: "LabelList",
        path: "labels",
        meta: { title: "标签" },
        component: () => import("@/views/LabelList.vue")
      },
      {
        name: "Photos",
        path: "photos/:id",
        meta: { title: "相册" },
        component: () => import("@/views/Photos.vue")
      },
      {
        name: "PhotoDetail",
        path: "photo/detail/:id",
        meta: { title: "相册图片" },
        component: () => import("@/views/PhotoDetail.vue")
      },
      {
        name: "Zone",
        path: "zone",
        meta: { title: "我的" },
        component: () => import("@/views/Zone.vue")
      }
    ]
  }
];

const routesRule = [
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
    name: "Category",
    params: {
      id: Utils.Textual.split(window.location.href, /\/category\/\d+/g, [2, 0], ["/", "."])
    }
  },
  {
    regex: /\/tag\/[\w\s\u4e00-\u9fa5\n\-\_%]+/g,
    name: "Label",
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
    name: "PhotoDetail",
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
  const matched = routesRule.find(rule => rule.regex.test(window.location.href));

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
