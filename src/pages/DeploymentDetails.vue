<template>
  <MainLayout :loading="isLoading">
    <input
      id="filter"
      name="filter"
      placeholder="Filter:"
      class="p-3 w-full text-lg"
      @input="(ev) => (filter = (ev.target as HTMLInputElement).value)"
    />
    <div
      v-for="log of filteredLogs"
      class="p-4 border-b border-gray-300 border-b-solid"
    >
      <span>{{ log }}</span>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
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
