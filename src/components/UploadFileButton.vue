<template>
  <div v-if="privilege && privilege.role == 'Rédacteur'"
    class="w-full py-2 flex justify-around items-center cursor-pointer"
    @click="emits('showUploadModal')">
    <span class="text-gray-500">
      Cliquer pour téléverser un documentt
    </span>
    <q-icon
      class="w-4 h-4 fill-gray-800 hover:bg-gray-800 hover:bg-opacity-30 p-1 hover:rounded-full cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    </q-icon>
  </div>
  <div v-else class="w-full py-2 flex justify-around items-center">
    <span class="text-gray-500">
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
