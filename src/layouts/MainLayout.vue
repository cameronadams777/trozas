<template>
  <TheNavBar />
  <div
    v-if="loading"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <TheLoader />
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import TheLoader from "src/components/TheLoader.vue";
import TheNavBar from "src/components/TheNavBar.vue";

defineProps<{ loading?: boolean }>();
</script>
