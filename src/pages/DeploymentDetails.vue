<template>
  <MainLayout :loading="isLoading">
    {{logs}}
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router"; 
import MainLayout from "src/layouts/MainLayout.vue";
import { useRancherClient } from "src/plugins/rancher-client";

const { params } = useRoute();
const rancherClient = useRancherClient();

const logs = ref<string>("");
const isLoading = ref<boolean>(true);

onMounted(async () => {
  try {
    const pods = await rancherClient
      .getPods(params.clusterId as string)
      .then((res: any) => 
        res.data
          .filter((value: any) => value.id.includes(params.deploymentId))
          .map((pod: any) => pod.id.replace(`${pod.metadata.namespace}/`, ""))
      );
    const logsResponse = (await Promise.all(
      pods.map(async (pod: any) => 
        await rancherClient.getLogs(params.clusterId as string, pod as string)
      )
    ) as string[]).join(" ");
    logs.value = logsResponse;
    isLoading.value = false;
  } catch(error) {
    console.error(error)
  }
});
</script>

