<template>
    <div class="flex" :class="{ 'in-progress': step.inProgress }">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
      </svg>
      <div class="preloader"></div>
      <div  style="cursor: pointer; text-align: center;">{{ step.title }}</div>
      <div  style="cursor: pointer;">
        <i :class="step.icon"></i>
      </div>
    </div>
    <div class="line"></div>


  </template>
<script setup>
let props = defineProps({
  step: Object,
});
</script>
