<template>
    <li style="color: red;">
      (line {{ line }}) - {{ message }} - {{ value[`${attribute}`] ? 'valeur entrée '  : 'pas de valeur entrée'}} ({{value[`${attribute}`]}})
    </li>
</template>
  
  <script setup>
import { computed, ref } from "vue";

const props = defineProps({
  message: {
    type: String,
    default: null,
  },
  value: {
    type: Array,
    default: null,
  },
  attribute: {
    type: String,
    default: null,
  },
  line: {
    type: String,
    default: null,
  },
});

</script>
    