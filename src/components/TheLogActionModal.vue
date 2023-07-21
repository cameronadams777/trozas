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
        <div class="pt-16 flex flex-col justify-center items-center">
          <h2>Show Logs in Surronding:</h2>
          <button @click="setRelativeTime(1)">1 Second</button>
          <button @click="setRelativeTime(5)">5 Seconds</button>
          <button @click="setRelativeTime(30)">30 Seconds</button>
          <button @click="setRelativeTime(60)">1 Minute</button>
          <button @click="setRelativeTime(60 * 5)">5 Mintues</button>
          <button @click="setRelativeTime(60 * 10)">10 Minutes</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import * as luxon from "luxon";
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "src/state/theme";
import { useFilterStore } from "src/state/filter";

const emit = defineEmits<{
  (e: "close"): void;
}>();
const props = defineProps<{ isOpen: boolean }>();

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

const filterStore = useFilterStore();
const { updateFilters } = filterStore;
const { filters } = storeToRefs(filterStore);

watch(
  () => props.isOpen,
  (value) => {
    const bodyEl = document.querySelector("body");
    if (!bodyEl) return;
    if (value) bodyEl.style.overflowY = "hidden";
    else bodyEl.style.overflowY = "auto";
  }
);

function setRelativeTime(time: number) {
  // Update filters state with relativeTime variable that adds specified time to timestamp of relativeLog variable
  if (filters.value.relativeLog) {
    const prevTime = luxon.DateTime.fromJSDate(
      filters.value.relativeLog.timestamp
    )
      .minus({
        seconds: time,
      })
      .toJSDate();
    const futureTime = luxon.DateTime.fromJSDate(
      filters.value.relativeLog.timestamp
    )
      .plus({
        seconds: time,
      })
      .toJSDate();
    updateFilters({
      relativeTimes: [prevTime, futureTime],
    });
    emit("close");
  }
  console.error("A log must be selected to use this feature.");
}
</script>
