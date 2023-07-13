<template>
  <nav
    class="p-4 flex items-center border-b border-b-solid bg-white border-gray-400"
  >
    <button
      v-if="$route.path !== '/' && $route.path !== '/home'"
      class="p-0 m-0 mr-4 flex items-center border-none bg-transparent font-bold text-blue-500 hover:text-blue-700 cursor-pointer"
      @click="$router.back()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-chevron-left"
      >
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <h2 class="m-0">Trozas</h2>
  </nav>
</template>
