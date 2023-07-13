<template>
  <MainLayout :loading="isLoading">
    <div class="flex flex-col">
      <input
        id="filter"
        name="filter"
        placeholder="Filter:"
        class="p-3 text-lg"
        @input="updateFilter"
      />
      <div
        v-for="log of filteredLogs"
        class="p-4 border-b border-gray-300 border-b-solid"
      >
        <span v-html="logWithHighlight(log)"></span>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import debounce from "lodash/debounce";
import MainLayout from "src/layouts/MainLayout.vue";
import { useRancherClient } from "src/plugins/rancher-client";

const { params } = useRoute();
const rancherClient = useRancherClient();

const filter = ref<string>("");
const logs = ref<string[]>([]);
const isLoading = ref<boolean>(true);

const filteredLogs = computed<string[]>(() =>
  logs.value.filter((val) => val.includes(filter.value))
);

const logWithHighlight = (log: string) =>
  filter.value.length > 0
    ? log.replace(
        filter.value,
        `<span class="p-0 m-0 bg-indigo-600 text-white">${filter.value}</span>`
      )
    : log;

const updateFilter = debounce(
  (ev: Event) => (filter.value = (ev.target as HTMLInputElement).value),
  500
);

onMounted(async () => {
  try {
    const pods = await rancherClient
      .getPods(params.clusterId as string)
      .then((res: any) =>
        res.data
          .filter((value: any) => value.id.includes(params.deploymentId))
          .map((pod: any) => pod.id.replace(`${pod.metadata.namespace}/`, ""))
      );
    const logsResponse = (
      await Promise.all(
        pods.map(
          async (pod: any) =>
            await rancherClient.getLogs(
              params.clusterId as string,
              params.environment as string,
              pod as string
            )
        )
      )
    )
      .join(" ")
      .split(/\r?\n/) as string[];
    logs.value = logsResponse;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>
