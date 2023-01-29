<template>
  <MainLayout :loading="isLoading">
    <button v-for="deployment of deployments" @click="$router.push(`/clusters/${params.clusterId}/deployments/${deployment.id.replace(`${deployment.metadata.namespace}/`, '')}`)">
      {{ deployment.metadata.name }}
    </button>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "src/layouts/MainLayout.vue";
import { useRancherClient } from "src/plugins/rancher-client";

const { params } = useRoute();
const rancherClient = useRancherClient();

const isLoading = ref<boolean>(true);
const deployments = ref<any[]>([]);

onMounted(async () => {
  try {
    const deploymentsResponse = await rancherClient.getDeployments(params.clusterId);
    deployments.value = deploymentsResponse.data;
    isLoading.value = false;
  } catch(error) {
    console.error(error);
  }
});
</script>
