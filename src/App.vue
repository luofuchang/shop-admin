<script setup>
</script>

<template>
  <router-view></router-view>
</template>

<style>
body {
  @apply bg-gray-100;
}

#nprogress .bar {
  background-color: #e81717 !important;
  height: 5px !important;
}
::-webkit-scrollbar{
  width: 4px;
  height: 6px;
}
::-webkit-scrollbar-corner{
  display: block;
}
::-webkit-scrollbar-thumb{
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-track{
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
