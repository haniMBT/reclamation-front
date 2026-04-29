<template>
  <div
    class="flex items-center justify-center w-full"
  >
    <label
      for="dropzone-file"
      class="flex flex-col items-center justify-center w-full border-[2.5px] border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      :class="`h-${height}`"
    >
      <div
        class="flex flex-col items-center justify-center py-6"
      >
        <svg
          class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
        </svg>
        <p
          class="mb-2 text-sm text-gray-500 dark:text-gray-400"
        >
          <span
            class="font-semibold"
          >
            Téléverser les documents traités
          </span>
          ou glisser-déposer
        </p>
        <p
          class="text-xs text-gray-500 dark:text-gray-400"
        >
          Fichiers {{ extensions }}
        </p>
        <div
          class="w-full grid grid-cols-2 px-2 mt-6 gap-2"
        >
          <p
            v-if="uploadedFiles?.length"
            v-for="item in uploadedFiles"
            class="w-full  justify-center items-center border-dashed border-[2px] rounded-xl p-2"
          >
            <span
              class="font-semibold text-[0.95rem]"
            >
              {{ item.name }}
            </span>
            <p
              class="text-gray-500"
            >
              ({{ (item.size/(1024*1024)).toFixed(2) }} Mo)
            </p>
          </p>
        </div>
      </div>
      <input
        ref="file"
        id="dropzone-file"
        type="file"
        class="hidden"
        :accept="accept"
        @change="handleFileChange"
        :multiple="multiple"
      />
    </label>
  </div>
</template>

<script setup>

import { ref } from "vue";
import {useQuasar} from "quasar";

const emits = defineEmits([
  'change'
])

const props = defineProps({
  height: {
    type: Number,
    default: 64
  },
  accept: {
    type: String,
    default: 'application/pdf'
  },
  extensions: {
    type: String,
    default: '(.pdf)'
  },
  multiple: {
    type: Boolean,
    default: true
  }
})
const file = ref(null)
const uploadedFiles = ref(null)
const $q = useQuasar()

const handleFileChange = () => {
  let canUpload = true
  let size = 0
  for(let i=0; i< file.value.files.length; i++){
    console.log(71, props.accept, props.accept.includes(file.value.files[i].type), file.value.files[i])
    size += file.value.files[i].size / (1024*1024)
    if(!props.accept.includes(file.value.files[i].type) || file.value.file)
      canUpload = false
  }
  canUpload = size > 40
    ? false
    : canUpload
  if(canUpload){
    uploadedFiles.value = file?.value?.files ?? []
    emits('change', uploadedFiles.value)
  }
  else
    $q.notify({
      type: 'negative',
      message: `Vous pouvez téléverser seulement les fichiers ${props.extensions}`
    })
}

</script>


<style scoped>

</style>
