<template>
  <Teleport to="#modal-target">
    <div
      class="fixed left-0 w-full rounded-md z-40 transition-top duration-500"
      :class="{
        'top-full': !isOpen,
        'top-0': isOpen,
        'bg-white text-gray-900': theme === 'light',
        'bg-gray-900 text-white': theme === 'dark',
        'min-h-full transition-colors duration-200': true,
      }"
    >
      <div class="relative">
        <button
          class="absolute top-5 right-5 bg-transparent text-current hover:text-blue-700 border-none z-50 cursor-pointer"
          @click="$emit('close')"
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
            class="feather feather-x"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="pt-16 flex justify-center items-center">
          <ul v-if="podIds.length">
            <h3>Filter by Pod</h3>
            <div v-for="pod in podIds">
              <input
                type="checkbox"
                :id="pod"
                :value="pod"
                @change="(e) => updateSelectedPods(e, pod)"
              />
              <label for="{{pod}}" class="ml-2">{{ pod }}</label>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "src/state/theme";
import { useFilterStore } from "src/state/filter";

defineEmits<{
  (e: "close"): void;
}>();
const props = defineProps<{ isOpen: boolean }>();

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

const filterStore = useFilterStore();
const { filtersAreSet, updateFilters } = filterStore;
const { filters, podIds } = storeToRefs(filterStore);

watch(
  () => props.isOpen,
  (value) => {
    const bodyEl = document.querySelector("body");
    if (!bodyEl) return;
    if (value) bodyEl.style.overflowY = "hidden";
    else bodyEl.style.overflowY = "auto";
  }
);

function updateSelectedPods(e: Event, pod: string) {
  const target = e.target as HTMLInputElement;
  if (target.checked) {
    updateFilters({ selectedPods: [...filters.value.selectedPods, pod] });
  } else {
    updateFilters({
      selectedPods: filters.value.selectedPods.filter((p) => p !== pod),
    });
  }
}
</script>
