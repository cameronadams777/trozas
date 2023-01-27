import { RancherClient } from "src/lib/rancher-client";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useRancherClient } from "src/plugins/rancher-client";

const authenticatedRoutes = ["/home"];

const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("../pages/Setup.vue") },
  { path: "/home", component: () => import("../pages/Home.vue") }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const rancherClient = useRancherClient();
  if(authenticatedRoutes.includes(to.path) && !rancherClient.hasConnectionDetails()) {
    return "/";
  }
})

export default router;
