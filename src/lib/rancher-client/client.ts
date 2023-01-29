import { ResponseType } from "@tauri-apps/api/http";
import * as httpClient from "src/lib/http-client";
import { IConnectionDetails } from "src/types";

// TODO: Need to type all requests
export class RancherClient {
  private connectionDetails: IConnectionDetails;

  constructor(connectionDetails: IConnectionDetails) {
    this.connectionDetails = connectionDetails;
  }
  
  public setConnectionDetails(connectionDetails: IConnectionDetails): void {
    this.connectionDetails = connectionDetails;
  }

  public getClusters(): Promise<any> {
    this.assertHasConnectionDetails();
    return httpClient.get({
      url: `${this.connectionDetails.instanceUrl}/v3/cluster`,
      options: {
        headers: this.buildHeaders(),
      }
    });
  }

  public getDeployments(clusterId: string): Promise<any> {
    this.assertHasConnectionDetails();
    return httpClient.get({
      url: `${this.connectionDetails.instanceUrl}/k8s/clusters/${clusterId}/v1/apps.deployments`,
      options: {
        headers: this.buildHeaders(),
      }
    });
  }

  public getPods(clusterId: string): Promise<any> {
    this.assertHasConnectionDetails();
    return httpClient.get({
      url: `${this.connectionDetails.instanceUrl}/k8s/clusters/${clusterId}/v1/pods`,
      options: {
        headers: this.buildHeaders(),
      }
    });
  }

  public getLogs(clusterId: string, podId: string): Promise<any> {
    this.assertHasConnectionDetails();
    return httpClient.get({
      url: `${this.connectionDetails.instanceUrl}/k8s/clusters/${clusterId}/api/v1/namespaces/dev/pods/${podId}/log?previous=false&timestamps=true&pretty=true&sinceSeconds=43200`,
      options: {
        responseType: ResponseType.Text,
        headers: this.buildHeaders(),
      }
    });
  }

  public hasConnectionDetails(): boolean {
    return Object.values(this.connectionDetails).every((value: string) => value.length > 0); 
  }


  /* PRIVATE */

  private buildHeaders(headers = {}): Record<string, any> {
    return {
      ...headers,
      Authorization: `Basic ${this.connectionDetails.apiToken}`
    };
  }

  private assertHasConnectionDetails(): void {
     if(!this.hasConnectionDetails()) throw new Error("Rancher Client: Invalid connection details");  
  }
}
