<template>
  <div
    class="tw-flex tw-items-center tw-justify-center tw-w-full"
  >
    <label
      for="dropzone-file"
      class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-border-[2.5px] tw-border-gray-300 tw-border-dashed tw-rounded-lg tw-cursor-pointer tw-bg-gray-50 tw-dark:hover:bg-bray-800 tw-dark:bg-gray-700 tw-hover:bg-gray-100 tw-dark:border-gray-600 tw-dark:hover:border-gray-500 tw-dark:hover:bg-gray-600"
      :class="`tw-h-${height}`"
    >
      <div
        class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-6"
      >
        <svg
          class="tw-w-8 tw-h-8 tw-mb-4 tw-text-gray-500 tw-dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
        </svg>
        <p
          class="tw-mb-2 tw-text-sm tw-text-gray-500 tw-dark:text-gray-400"
        >
          <span
            class="tw-font-semibold"
          >
            Téléverser les documents traités
          </span>
          ou glisser-déposer
        </p>
        <p
          class="tw-text-xs tw-text-gray-500 tw-dark:text-gray-400"
        >
          Fichiers {{ extensions }}
        </p>
        <div
          class="tw-w-full tw-grid tw-grid-cols-2 tw-px-2 tw-mt-6 tw-gap-2"
        >
          <p
            v-if="uploadedFiles?.length"
            v-for="item in uploadedFiles"
            class="tw-w-full  tw-justify-center tw-items-center tw-border-dashed tw-border-[2px] tw-rounded-xl tw-p-2"
          >
            <span
              class="tw-font-semibold tw-text-[0.95rem]"
            >
              {{ item.name }}
            </span>
            <p
              class="tw-text-gray-500"
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
        class="tw-hidden"
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
