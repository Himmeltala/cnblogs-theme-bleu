import { createRouter, createWebHashHistory } from "vue-router";
import { redirect } from "@/utils/router-helper";

const routes = [
  {
    name: RouterName.Index,
    path: RouterPath.index(),
    component: () => import("@/views/Index.vue")
  },
  {
    name: RouterName.Profile,
    path: RouterPath.profile(),
    component: () => import("@/views/Profile.vue")
  },
  {
    name: RouterName.Works,
    path: RouterPath.works(),
    component: () => import("@/views/Works.vue")
  },
  {
    name: RouterName.WorksByMark,
    path: RouterPath.worksByMark(),
    component: () => import("@/views/WorksByMark.vue")
  },
  {
    name: RouterName.WorksBySort,
    path: RouterPath.worksBySort(),
    component: () => import("@/views/WorksBySort.vue")
  },
  {
    name: RouterName.WorksByArchive,
    path: RouterPath.worksByArchive(),
    component: () => import("@/views/WorksByArchive.vue")
  },
  {
    name: RouterName.WorksByCalendar,
    path: RouterPath.worksByCalendar(),
    component: () => import("@/views/WorksByCalendar.vue")
  },
  {
    name: RouterName.MarkList,
    path: RouterPath.markList(),
    component: () => import("@/views/MarkList.vue")
  },
  {
    name: RouterName.Albumn,
    path: RouterPath.albumn(),
    component: () => import("@/views/Albumn.vue")
  },
  {
    name: RouterName.AlbumnItem,
    path: RouterPath.albumnItem(),
    component: () => import("@/views/AlbumnItem.vue")
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
