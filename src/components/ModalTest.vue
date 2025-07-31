<template>
  <div>
    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div class="bg-white w-1/2 rounded-lg shadow-lg p-6">
        <!-- Modal Content -->
        <h2 class="text-lg font-semibold border-b pb-2 mb-4">
          {{titleModal }}
        </h2>

        <slot name="profile"></slot>

        <div class="mt-6 flex justify-end">
            <button
              @click="close"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
            >
              Fermer
            </button>
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
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