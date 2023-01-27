import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const authenticatedRoutes = ["/home"];

const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("../pages/Setup.vue") },
  { path: "/home", component: () => import("../pages/Home.vue") }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// TODO: Add logic for redirects depending on connectionDetail availablility

export default router;
