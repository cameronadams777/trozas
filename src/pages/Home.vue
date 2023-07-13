<template>
  <MainLayout :loading="isLoading">
    <div class="border border-gray-300 rounded-lg">
      <button
        v-for="cluster of clusters"
        class="w-full flex justify-between items-center m-0 p-3 bg-white hover:bg-gray-900 hover:text-white text-left border-none border-b border-gray-300 border-b-solid text-lg transition-colors duration-200 cursor-pointer"
        @click="$router.push(`/clusters/${cluster.id}`)"
      >
        {{ cluster.name }}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-chevron-right"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRancherClient } from "src/plugins/rancher-client";
import MainLayout from "src/layouts/MainLayout.vue";

const isLoading = ref(true);
const clusters = ref<any[]>([]);

const router = useRouter();
const rancherClient = useRancherClient();

onMounted(async () => {
  try {
    const clusterData = await rancherClient.getClusters();
    clusters.value = clusterData.data.sort((a: any, b: any) =>
      a.name.localeCompare(b.name)
    );
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    router.push("/500");
    // TODO: Redirect to 500 page
  }
});
</script>
