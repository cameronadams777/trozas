<template>
  <MainLayout :loading="isLoading">
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRancherClient } from "src/plugins/rancher-client";
import MainLayout from "src/layouts/MainLayout.vue";

const isLoading = ref(true);
const clusters = ref<any[]>([]);

const rancherClient = useRancherClient();

onMounted(async () => {
  try {
    const clusterData = await rancherClient.getClusters();
    console.log(clusterData)
    clusters.value = clusterData;
    isLoading.value = false;
  } catch(error) {
    console.error(error);
    // TODO: Redirect to 500 page
  }
});
</script>
