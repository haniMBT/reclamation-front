<template>
  <q-page class="flex justify-center bg-amber-50">
    <div v-if="userCan()" class="flex flex-col w-full flex-grow-1 mx-8 my-4">
      <h1 class="text-header-text text-2xl font-[500] mx-4 px-4">
        {{ title }}
      </h1>
      <div class="flex flex-col bg-white flex-grow rounded-xl m-4 p-4">
        <slot name="page"></slot>
      </div>
    </div>
    <div v-else class="flex flex-col w-full flex-grow-1 mx-8 my-4">
      <Unauthorized />
    </div>
  </q-page>
</template>
<script setup>
import { useAuthStore } from "stores/auth";
import { onBeforeMount } from "vue";
import Unauthorized from "./Unauthorized.vue";

const authStore = useAuthStore()
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  volet: {
    type: String,
    default: null,
  },
  privilegeType: {
    type: String,
    default: null,
  },
});


const userCan = () => {
  return props.privilegeType ? authStore[props.privilegeType] : authStore.canConsultation;
}

onBeforeMount(() => {
  if (props.volet) {
    authStore.setProperty('volet', props.volet)
  }
});
</script>
