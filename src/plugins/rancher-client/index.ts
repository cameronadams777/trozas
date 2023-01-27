import { App, Plugin } from "vue";
import { IRancherClientPluginOptions, RC_PROVIDER_KEY } from "./types";

export const RancherClientPlugin: Plugin = {
  install(app: App, options: IRancherClientPluginOptions) {
    app.provide(RC_PROVIDER_KEY, options.client);
  }
}

export { useRancherClient } from "./composable";
export type { IRancherClientPluginOptions } from "./types";
