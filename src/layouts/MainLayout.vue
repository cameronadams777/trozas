<template>
  <div
    :class="{
      'bg-white text-gray-900': theme === 'light',
      'bg-gray-900 text-white': theme === 'dark',
      'min-h-full transition-colors duration-200': true,
    }"
  >
    <TheNavBar />
    <div
      v-if="loading"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <TheLoader />
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import TheLoader from "src/components/TheLoader.vue";
import TheNavBar from "src/components/TheNavBar.vue";
import { useThemeStore } from "src/state/theme";

const themeStore = useThemeStore();

const { theme } = storeToRefs(themeStore);

defineProps<{ loading?: boolean }>();
</script>
