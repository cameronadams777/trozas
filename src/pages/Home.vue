<template>
  <MainLayout :loading="isLoading">
    <div class="flex flex-col">
      <input
        id="filter"
        name="filter"
        placeholder="Filter:"
        autocomplete="off"
        class="p-3 text-lg"
        @input="(ev) => (filter = (ev.target as HTMLInputElement).value)"
      />
      <div class="border border-gray-300 rounded-lg">
        <router-link
          v-for="cluster of filteredClusters"
          class="flex justify-between items-center text-current hover:bg-blue-700 hover:text-white no-underline m-0 p-3 text-left border-none border-b border-gray-300 border-b-solid text-lg transition-colors duration-200 cursor-pointer"
          :to="`/clusters/${cluster.id}`"
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
        </router-link>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRancherClient } from "src/plugins/rancher-client";
import MainLayout from "src/layouts/MainLayout.vue";

const isLoading = ref(true);
const filter = ref<string>("");
const clusters = ref<any[]>([]);

const router = useRouter();
const rancherClient = useRancherClient();

const filteredClusters = computed<any[]>(() =>
  clusters.value.filter((val) => val.name.includes(filter.value))
);

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
