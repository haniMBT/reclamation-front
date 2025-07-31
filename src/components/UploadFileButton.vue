<template>
  <div v-if="privilege && privilege.role == 'Rédacteur'"
    class="tw-w-full tw-py-2 tw-flex tw-justify-around tw-items-center tw-cursor-pointer"
    @click="emits('showUploadModal')">
    <span class="tw-text-gray-500">
      Cliquer pour téléverser un documentt
    </span>
    <q-icon
      class="tw-w-4 tw-h-4 tw-fill-gray-800 hover:tw-bg-gray-800 hover:tw-bg-opacity-30 tw-p-1 hover:tw-rounded-full tw-cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="tw-w-6 tw-h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    </q-icon>
  </div>
  <div v-else class="tw-w-full tw-py-2 tw-flex tw-justify-around tw-items-center">
    <span class="tw-text-gray-500">
      Vous n'avez pas les privilèges pour téléverser un document
    </span>
  </div>
</template>

<script setup>

const emits = defineEmits([
  'showUploadModal'
])

const props = defineProps({
  privilege: {
    type: Object,
    default: {}
  },
})

</script>

<style scoped></style>
