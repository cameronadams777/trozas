import { toRaw } from "vue";
import { defineStore } from "pinia";
import isEqual from "lodash/isEqual";
import { ILog } from "src/types";

interface IFilters {
  selectedPods: string[];
  relativeLog?: ILog;
  relativeTimes?: [Date, Date];
}

interface IFilterState {
  podIds: string[];
  filters: IFilters;
}

const defaultFilterState: IFilterState = {
  podIds: [],
  filters: {
    selectedPods: [],
    relativeLog: undefined,
    relativeTimes: undefined,
  },
};

export const useFilterStore = defineStore({
  id: "filters_store",
  state: (): IFilterState => ({
    podIds: [],
    filters: {
      selectedPods: [],
      relativeLog: undefined,
      relativeTimes: undefined,
    },
  }),
  getters: {
    filtersAreSet(state): boolean {
      return !isEqual(toRaw(state.filters), defaultFilterState.filters);
    },
  },
  actions: {
    updatePodIds(newPodIds: string[]): void {
      this.podIds = newPodIds;
    },
    updateFilters(newFiltersState: Partial<IFilters>): void {
      this.filters = {
        ...this.filters,
        ...newFiltersState,
      };
    },
    resetState(): void {
      this.$reset();
    },
  },
});
