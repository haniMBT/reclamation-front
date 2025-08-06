<script setup>
defineProps(['value']);
</script>

<template>
  <label class="block font-medium text-sm">
    <span class="text-blue-login-420" v-if="value">{{ value }}</span>
    <span><slot /></span>
  </label>
</template>
