<template>
  <MainLayout>
    <SetupForm @on-complete="$router.push('/home')" />
  </MainLayout>
</template>

<script setup lang="ts">
  import MainLayout from 'src/layouts/MainLayout.vue';
  import SetupForm from 'src/components/SetupForm.vue';
</script>
