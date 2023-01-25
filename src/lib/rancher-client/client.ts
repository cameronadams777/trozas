import * as httpClient from "src/lib/http-client";
import { IConnectionDetails } from "src/types";

interface IRancherClientInitializeOptions {
  connectionDetails: IConnectionDetails | undefined;
}

interface ISetConnectionDetailsOptions {
  connectionDetails: IConnectionDetails | undefined;
}

interface IRancherClient {
  connectionDetails: IConnectionDetails | undefined;
  initialize: (args: IRancherClientInitializeOptions) => void;
  setConnectionDetails: (args: ISetConnectionDetailsOptions) => void;
  getClusters: () => Promise<any>;
}

// TODO: Need to create types for these functions. All request functions
// should have their response schema validated using zod.
export const RancherClient: IRancherClient = {
  connectionDetails: undefined,
  initialize({ connectionDetails }) {
    this.connectionDetails = connectionDetails;
  },
  setConnectionDetails({ connectionDetails }) {
    this.connectionDetails = connectionDetails;
  },
  async getClusters()  {
    if(this.connectionDetails == null) return; // TODO: Add better handling here. Should check for connection details, throw error but preserve types if connection details exists.
    return httpClient.get({
      url: `${this.connectionDetails?.instanceUrl}/v3/cluster`,
      options: {
        headers: {
          Authorization: `Basic ${this.connectionDetails.apiToken}`
        }
      }
    }); 
  }
}
