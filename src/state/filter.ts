import { defineStore } from "pinia";

interface IFilters { 
  podIds: string[];
  selectedPods: string[];
}

interface IFilterState {
  filters: IFilters;
}

export const useFilterStore = defineStore({
  id: "filters_store",
  state: (): IFilterState => ({
    filters: {
      podIds: [],
      selectedPods: [],
    },
  }),
  actions: {
    updateFilters(newFiltersState: Partial<IFilters>): void {
      this.filters = {
         ...this.filters,
         ...newFiltersState
      };
    },
  },
});
