<template>
  <div
    v-if="uploadProgress"
    class="flex flex-col justify-center items-center my-2 gap-2"
  >
    <div
      class="w-full bg-[#e0e0e0] h-6 rounded overflow-hidden"
    >
      <div
        class="h-full bg-[#4caf50] flex justify-end items-center rounded text-white px-2 gap-3 text-[1.03rem]"
        :style="{ width: uploadProgress.percentage + '%' }"
      >
        <label
          class="font-bold"
        >
          {{uploadProgress.percentage}}%
        </label>
        <label>
          ({{ uploadProgress.loaded }}Mo/{{uploadProgress.total}}Mo)
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  uploadProgress: {
    type: Object,
    default: null
  }
})

</script>

<style scoped>

</style>
