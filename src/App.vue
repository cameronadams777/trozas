<script setup lang="ts">
import MainLayout from 'src/layouts/MainLayout.vue';
import SetupForm from 'src/components/SetupForm.vue';
</script>

<template>
  <MainLayout>
    <SetupForm />
  </MainLayout>
</template>

<style>
html, body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
