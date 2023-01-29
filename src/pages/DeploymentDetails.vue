<template>
  <MainLayout :loading="isLoading">
    <span>Hello</span>
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

onMounted(async () => {
  try {
    const pods = await rancherClient
      .getPods(params.clusterId as string)
      .then((res: any) => 
        res.data.filter(value => value.id.includes(params.deploymentId))
      );
    isLoading.value = false;
  } catch(error) {
    console.error(error)
  }
});
</script>

