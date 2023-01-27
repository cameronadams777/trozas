import { RancherClient } from "src/lib/rancher-client";

export const RC_PROVIDER_KEY = "rancher-client";

export interface IRancherClientPluginOptions {
  client: RancherClient;
}
