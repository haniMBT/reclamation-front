<template>
  <q-page class="tw-flex tw-justify-center tw-bg-amber-50">
    <div v-if="userCan()" class="tw-flex tw-flex-col tw-w-full tw-flex-grow-1 tw-mx-8 tw-my-4">
      <h1 class="tw-text-header-text tw-text-2xl tw-font-[500] tw-mx-4 tw-px-4">
        {{ title }}
      </h1>
      <div class="tw-flex tw-flex-col tw-bg-white tw-flex-grow tw-rounded-xl tw-m-4 tw-p-4">
        <slot name="page"></slot>
      </div>
    </div>
    <div v-else class="tw-flex tw-flex-col tw-w-full tw-flex-grow-1 tw-mx-8 tw-my-4">
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
