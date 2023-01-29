<template>
  <MainLayout :loading="isLoading">
    <div class="border border-gray-300 rounded-lg">
      <button 
        v-for="cluster of clusters" 
        @click="$router.push(`/clusters/${cluster.id}`)"
      >
        {{ cluster.name }}
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
    clusters.value = clusterData.data;
    isLoading.value = false;
  } catch(error) {
    console.error(error);
    router.push("/500");
    // TODO: Redirect to 500 page
  }
});
</script>
