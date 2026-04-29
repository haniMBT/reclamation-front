<template>
  <div v-if="typeof myerrors == 'object' || Array.isArray(myerrors)">
    <ul v-for="(new_error, nameindex) in myerrors" :key="nameindex">
      <li v-if="new_error" style="color: red">
        {{ new_error }}
      </li>
    </ul>
  </div>
  <ul v-else>
    <li v-if="myerrors" style="color: red">
      {{ myerrors }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  myerrors: {
    type: [String, Array, Object],
    default: null,
  },
});
</script>
  