<template>
  <MainLayout :loading="isLoading">
    <button
      v-for="deployment of deployments"
      class="w-full flex justify-between items-center m-0 p-3 bg-white hover:bg-gray-900 hover:text-white text-left border-none border-b border-gray-300 border-b-solid text-lg transition-colors duration-200 cursor-pointer"
      @click="
        $router.push(
          `/clusters/${params.clusterId}/deployments/${deployment.id.replace(
            `${deployment.metadata.namespace}/`,
            ''
          )}`
        )
      "
    >
      {{ deployment.metadata.name }}
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
      params.clusterId as string
    );
    deployments.value = deploymentsResponse.data.sort((a: any, b: any) =>
      a.metadata.name.localeCompare(b.metadata.name)
    );
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>
