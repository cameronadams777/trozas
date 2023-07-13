<template>
  <MainLayout :loading="isLoading">
    <div class="flex flex-col">
      <input
        id="filter"
        name="filter"
        placeholder="Filter:"
        class="p-3 text-lg"
        @input="(ev) => (filter = (ev.target as HTMLInputElement).value)"
      />
      <router-link
        v-for="deployment of filteredDeployments"
        class="flex justify-between items-center m-0 p-3 text-current hover:bg-blue-700 hover:text-white no-underline text-left border-none border-b border-gray-300 border-b-solid text-lg transition-colors duration-200 cursor-pointer"
        :to="`/clusters/${params.clusterId}/deployments/${deployment.id.replace(
          `${deployment.metadata.namespace}/`,
          ''
        )}/environment/${deployment.id.split('/')[0]}`"
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
      </router-link>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "src/layouts/MainLayout.vue";
import { useRancherClient } from "src/plugins/rancher-client";

const { params } = useRoute();
const rancherClient = useRancherClient();

const filter = ref<string>("");
const isLoading = ref<boolean>(true);
const deployments = ref<any[]>([]);

const filteredDeployments = computed<any[]>(() =>
  deployments.value.filter((deployment) =>
    deployment.metadata.name.includes(filter.value)
  )
);

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
