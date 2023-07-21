import { defineStore } from "pinia";
import { ILog } from "src/types";

interface IFilters {
  podIds: string[];
  selectedPods: string[];
  relativeLog?: ILog;
  relativeTimes?: [Date, Date];
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
      relativeLog: undefined,
      relativeTimes: undefined,
    },
  }),
  actions: {
    updateFilters(newFiltersState: Partial<IFilters>): void {
      this.filters = {
        ...this.filters,
        ...newFiltersState,
      };
    },
  },
});
