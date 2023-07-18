<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col justify-center items-center"
  >
    <div class="w-7/8 lg:w-1/3 flex flex-col mb-4">
      <label for="instanceUrl" class="mb-2 font-bold">Instance URL</label>
      <input
        v-model="form.instanceUrl"
        type="text"
        class="p-2 rounded-sm border-none"
      />
    </div>
    <div class="w-7/8 lg:w-1/3 flex flex-col mb-4">
      <label for="apiToken" class="mb-2 font-bold">API Token</label>
      <input
        v-model="form.apiToken"
        type="text"
        class="p-2 rounded-sm border-none"
      />
    </div>
    <button
      class="w-7/8 lg:w-1/10 px-8 py-2 bg-blue-500 hover:bg-blue-700 rounded-md border-none text-white text-lg font-bold cursor-pointer"
      @click="submitInstanceDetails"
    >
      Submit
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { saveConnectionDetails } from "src/lib/trozas";
import { useRancherClient } from "src/plugins/rancher-client";

const router = useRouter();
const rancherClient = useRancherClient();

const form = reactive({
  instanceUrl: "",
  apiToken: "",
});

async function submitInstanceDetails() {
  try {
    const connectionDetails = await saveConnectionDetails(form);
    rancherClient.setConnectionDetails(connectionDetails);
    router.push("/home");
  } catch (error) {
    console.log(error);
    // TODO: Add toast messaging if submit fails
  }
}
</script>
