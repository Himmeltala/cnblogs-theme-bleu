import { createRouter, createWebHashHistory } from "vue-router";
import { redirect, name } from "@/utils/router-helper";

const routes = [
  {
    name: name.Index,
    path: "/",
    component: () => import("@/views/Index.vue")
  },
  {
    name: name.Writing,
    path: "/p/:id",
    component: () => import("@/views/Writing.vue")
  },
  {
    name: name.Home,
    path: "/home",
    component: () => import("@/views/Home.vue")
  },
  {
    name: name.MarkSort,
    path: "/mark/:tag",
    component: () => import("@/views/MarkSort.vue")
  },
  {
    name: name.Sort,
    path: "/sort/:mode/:id",
    component: () => import("@/views/Sort.vue")
  },
  {
    name: name.Archive,
    path: "/archive/:mode/:date?",
    component: () => import("@/views/Archive.vue")
  },
  {
    name: name.MarkList,
    path: "/marks",
    component: () => import("@/views/MarkList.vue")
  },
  {
    name: name.Albumn,
    path: "/albumn/:id",
    component: () => import("@/views/Albumn.vue")
  },
  {
    name: name.AlbumnItem,
    path: "/album/item/:id",
    component: () => import("@/views/AlbumnItem.vue")
  },
  {
    name: name.Calendar,
    path: "/calendar",
    component: () => import("@/views/Calendar.vue")
  }
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { el: "#app", top: 0, behavior: "smooth" };
    }
  }
});

router.beforeEach((to, from, next) => {
  redirect(next)();
});

export default router;
