import { RancherClient } from "src/lib/rancher-client";
import { inject } from "vue";
import { RC_PROVIDER_KEY } from "./types";

// TODO: Figure out how to fix the type error below. Should by default always return
// a client because an error is thrown if it is not resulting in an unhandled exception
export const useRancherClient = (): RancherClient => {
  const client: RancherClient | undefined = inject(RC_PROVIDER_KEY);
  if(!client) throw new Error("RancherClientPlugin: No client available");
  return client;
}
