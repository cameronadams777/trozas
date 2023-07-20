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
    <main v-else class="pt-15">
      <slot />
    </main>
    <button
      class="fixed bottom-5 right-5 w-12 h-12 bg-blue-500 hover:bg-blue-700 shadow-md border-none rounded-full text-white transition-colors duration-300"
      @click="scrollTop"
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
        class="feather feather-arrow-up"
      >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
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

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
