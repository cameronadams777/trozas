<template>
  <MainLayout :loading="isLoading">
    <template v-slot:nav-buttons>
      <button
        class="m-0 mr-4 p-0 bg-transparent text-current hover:text-blue-500 border-none transition-colors duration-200 cursor-pointer"
        @click="isFilterModalOpen = !isFilterModalOpen"
      >
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
          class="feather feather-filter"
        >
          <polygon
            points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
          ></polygon>
        </svg>
      </button>
    </template>
    <div class="flex flex-col">
      <input
        id="filter"
        name="filter"
        placeholder="Filter:"
        autocomplete="off"
        spellcheck="false"
        class="p-3 text-lg"
        @input="updateFilter"
      />
      <button
        v-for="log of filteredLogs"
        :disabled="filters.relativeLog === log"
        class="p-4 text-left border-none border-b border-gray-300 border-b-solid hover:text-white transition-colors duration-200"
        :class="{
          'bg-yellow-700 text-white': filters.relativeLog === log,
          'bg-inherit hover:bg-blue-700 cursor-pointer':
            filters.relativeLog !== log,
        }"
        @click="
          () => {
            updateFilters({ relativeLog: log });
            isLogActionModalOpen = true;
          }
        "
      >
        <span v-html="logWithHighlight(log.value)" class="break-words"></span>
      </button>
    </div>
    <div
      v-if="logs.length > page * LOGS_PER_PAGE && !filters.relativeLog"
      class="p-4 w-load-more flex justify-center"
    >
      <button
        class="border-none text-current text-lg font-bold bg-transparent transition-colors duration-200 cursor-pointer hover:underline hover:text-blue-500"
        @click="() => page++"
      >
        Load More
      </button>
    </div>
    <TheLogActionModal
      :is-open="isLogActionModalOpen"
      @close="isLogActionModalOpen = false"
    />
    <TheFilterModal
      :is-open="isFilterModalOpen"
      @close="isFilterModalOpen = false"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { from } from "rxjs";
import debounce from "lodash/debounce";
import * as luxon from "luxon";
import MainLayout from "src/layouts/MainLayout.vue";
import TheFilterModal from "src/components/TheFilterModal.vue";
import TheLogActionModal from "src/components/TheLogActionModal.vue";
import { ILog } from "src/types";
import { useFilterStore } from "src/state/filter";
import { useRancherClient } from "src/plugins/rancher-client";
import { storeToRefs } from "pinia";

const { params } = useRoute();
const rancherClient = useRancherClient();

const filterStore = useFilterStore();
const { updateFilters } = filterStore;
const { filters } = storeToRefs(filterStore);

const LOGS_PER_PAGE: number = 100;

const logs = ref<ILog[]>([]);
const filter = ref<string>("");
const page = ref<number>(1);
const isLoading = ref<boolean>(true);
const isFilterModalOpen = ref<boolean>(false);
const isLogActionModalOpen = ref<boolean>(false);

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

const filteredLogs = computed<ILog[]>(() => {
  if (filters.value.relativeLog && filters.value.relativeTimes?.length) {
    return logs.value.filter((log) => {
      const logTime = luxon.DateTime.fromJSDate(log.timestamp);
      const relativeTimes =
        filters.value.relativeTimes?.map((time) =>
          luxon.DateTime.fromJSDate(time)
        ) ?? [];
      return logTime > relativeTimes[0] && logTime < relativeTimes[1];
    });
  }
  return logs.value
    .filter((log) =>
      filters.value.selectedPods.length
        ? filters.value.selectedPods.includes(log.podId)
        : true
    )
    .filter((log) => log.value.includes(filter.value))
    .slice(1, page.value * LOGS_PER_PAGE);
});

onMounted(async () => {
  try {
    const pods: string[] = await rancherClient
      .getPods(params.clusterId as string)
      .then((res: any) =>
        res.data
          .filter((value: any) => value.id.includes(params.deploymentId))
          .map((pod: any) => pod.id.replace(`${pod.metadata.namespace}/`, ""))
      );

    updateFilters({ podIds: pods });

    pods.forEach((pod: string) =>
      from(
        rancherClient.getLogs(
          params.clusterId as string,
          params.environment as string,
          pod
        )
      ).subscribe((logData: string) => {
        const formattedLogs = logData.split(/\r?\n/).map((log) => ({
          timestamp: new Date(log.substring(0, log.indexOf("Z") + 1)),
          podId: pod,
          value: log,
        }));
        logs.value.push(...formattedLogs);
        isLoading.value = false;
      })
    );
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
.w-load-more {
  width: calc(100% - 2rem);
}
</style>
