import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { getConnectionDetails } from "src/lib/trozas";
import { useFilterStore } from "src/state/filter";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "Setup", component: () => import("src/pages/Setup.vue") },
  {
    path: "/home",
    name: "Home",
    component: () => import("src/pages/Home.vue"),
  },
  {
    path: "/clusters/:clusterId/deployments/:deploymentId/environment/:environment",
    name: "DeploymentDetails",
    component: () => import("src/pages/DeploymentDetails.vue"),
  },
  {
    path: "/clusters/:clusterId",
    name: "ClusterDetails",
    component: () => import("src/pages/ClusterDetails.vue"),
  },
  { path: "/500", name: "500", component: () => import("src/pages/500.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// TODO: Add logic for redirects depending on connectionDetail availablility
router.beforeEach(async (to, from) => {
  // Ensure to clear filters when navigating to a new page
  const { updatePodIds, updateFilters } = useFilterStore();
  updatePodIds([]);
  updateFilters({
    selectedPods: [],
    relativeLog: undefined,
    relativeTimes: undefined,
  });

  const connectionDetails = await getConnectionDetails();
  const hasConnectionDetails = Object.values(connectionDetails).every(
    (val) => val.length > 0
  );
  if (to.path !== "/" && !hasConnectionDetails) return { name: "Setup" };
  if (to.path === "/" && hasConnectionDetails) return { name: "Home" };
});

export default router;
