<script setup>
defineProps(['value']);
</script>

<template>
  <label class="tw-block tw-font-medium tw-text-sm">
    <span class="tw-text-blue-login-420" v-if="value">{{ value }}</span>
    <span><slot /></span>
  </label>
</template>
