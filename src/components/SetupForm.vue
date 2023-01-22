<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <div class="flex flex-col mb-4">
      <label for="instanceUrl" class="font-bold">Instance URL</label>
      <input v-model="form.instanceUrl" type="text" />
    </div>
    <div class="flex flex-col mb-4">
      <label for="apiToken" class="font-bold">API Token</label>
      <input v-model="form.apiToken" type="text" />
    </div>
    <button 
      class="px-8 py-2 bg-blue-500 hover:bg-blue-700 rounded-md border-none text-white cursor-pointer"
      @click="submitInstanceDetails"
    >
      Submit
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { invoke } from '@tauri-apps/api';

const form = reactive({
  instanceUrl: '',
  apiToken: '',
});

async function submitInstanceDetails () {
  try {
    const connectionDetails = await invoke("save_connection_details", form);
    console.log(connectionDetails);
  } catch(error) {
    console.log(error)
    // TODO: Add toast messaging if submit fails
  }
}
</script>
