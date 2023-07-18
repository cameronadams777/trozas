<template>
  <MainLayout :loading="isLoading">
    <div class="flex flex-col">
      <input
        id="filter"
        name="filter"
        placeholder="Filter:"
        autocomplete="off"
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
    <div
      v-if="logs.length > page * LOGS_PER_PAGE"
      class="p-4 w-full flex justify-center"
    >
      <button
        class="border-none text-current text-lg font-bold bg-transparent transition-colors duration-200 cursor-pointer hover:underline hover:text-blue-500"
        @click="() => page++"
      >
        Load More
      </button>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { from } from "rxjs";
import debounce from "lodash/debounce";
import MainLayout from "src/layouts/MainLayout.vue";
import { useRancherClient } from "src/plugins/rancher-client";
const { params } = useRoute();
const rancherClient = useRancherClient();

const LOGS_PER_PAGE: number = 100;

const logs = ref<string[]>([]);
const filter = ref<string>("");
const page = ref<number>(1);
const isLoading = ref<boolean>(true);

const logWithHighlight = (log: string): string =>
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

const filteredLogs = computed<string[]>(() =>
  logs.value
    .filter((val) => val.includes(filter.value))
    .slice(1, page.value * LOGS_PER_PAGE)
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

    pods.forEach((pod: string) =>
      from(
        rancherClient.getLogs(
          params.clusterId as string,
          params.environment as string,
          pod
        )
      ).subscribe((logData) => {
        const formattedLogs = logData.split(/\r?\n/);
        logs.value.push(...formattedLogs);
        isLoading.value = false;
      })
    );
  } catch (error) {
    console.error(error);
  }
});
</script>
