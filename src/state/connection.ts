import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";
import { IConnectionDetails } from "src/types";

interface ISaveConnectionDetailsInput {
  instanceUrl: string;
  apiToken: string;
}

interface IConnectionDetailsStoreState {
  connectionDetails: IConnectionDetails; 
}

export const useConnectionDetailsStore = defineStore({
  id: 'connection-details',
  state: (): IConnectionDetailsStoreState => {
    return {
      connectionDetails: {
        instanceUrl: "",
        apiToken: ""
      }
    }
  },
  actions: {
    async getConnectionDetails() {
      // Check to see if details are in state
      if(Object.values(this.connectionDetails).every(value => value.length !== 0)) {
        return this.connectionDetails;
      }
      const connectionDetails = await invoke<IConnectionDetails>("get_connection_details");
      this.connectionDetails = connectionDetails;
      return connectionDetails;
    },
    async saveConnectionDetails(form: ISaveConnectionDetailsInput) {   
      const connectionDetails = await invoke<IConnectionDetails>("save_connection_details", { 
        ...form 
      });
      this.connectionDetails = connectionDetails;
    }
  }
})
