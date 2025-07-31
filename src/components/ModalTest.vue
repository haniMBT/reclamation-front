<template>
  <div>
    <!-- Modal -->
    <div
      v-if="showModal"
      class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-50"
    >
      <div class="tw-bg-white tw-w-1/2 tw-rounded-lg tw-shadow-lg tw-p-6">
        <!-- Modal Content -->
        <h2 class="tw-text-lg tw-font-semibold tw-border-b tw-pb-2 tw-mb-4">
          {{titleModal }}
        </h2>

        <slot name="profile"></slot>

        <div class="tw-mt-6 tw-flex tw-justify-end">
            <button
              @click="close"
              class="tw-bg-gray-300 tw-hover:bg-gray-400 tw-text-gray-800 tw-font-semibold tw-py-2 tw-px-4 tw-rounded tw-mr-2"
            >
              Fermer
            </button>
            <button
              class="tw-bg-blue-500 tw-hover:bg-blue-600 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded"
              @click="submitForm"
            >
              Enregistrer
            </button>
          </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref } from "vue";

defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  titleModal: {
    type: String,
    default: 'Modification',
  },
});

const emits = defineEmits([
    "close", "submitForm"
]);
const close = () => {
  emits("close");
};
const submitForm = () => {
  emits("submitForm" );
  // close()
};


</script>

<style>
/* Additional CSS styles can be added here */
</style>