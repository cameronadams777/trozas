import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

//const authenticatedRoutes = ["/home"];

const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("src/pages/Setup.vue") },
  { path: "/home", component: () => import("src/pages/Home.vue") },
  {
    path: "/clusters/:clusterId/deployments/:deploymentId",
    component: () => import("src/pages/DeploymentDetails.vue"),
  },
  {
    path: "/clusters/:clusterId",
    component: () => import("src/pages/ClusterDetails.vue"),
  },
  { path: "/500", component: () => import("src/pages/500.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// TODO: Add logic for redirects depending on connectionDetail availablility

export default router;
