import { createRouter, createWebHashHistory } from "vue-router";
import { redirect, routes } from "@/helpers/router-helper";

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
    Broswer.setTitle(`${to.meta.title}`);
  }
});

export default router;
