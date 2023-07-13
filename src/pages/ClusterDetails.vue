<template>
  <MainLayout :loading="isLoading">
    <button
      v-for="deployment of deployments"
      class="w-full m-0 p-3 bg-white hover:bg-gray-900 hover:text-white border-none border-b border-gray-300 border-b-solid text-lg transition-colors duration-200 cursor-pointer"
      @click="
        $router.push(
          `/clusters/${params.clusterId}/deployments/${deployment.id.replace(
            `${deployment.metadata.namespace}/`,
            '',
          )}`,
        )
      "
    >
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
    const deploymentsResponse = await rancherClient.getDeployments(
      params.clusterId,
    );
    deployments.value = deploymentsResponse.data;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>
