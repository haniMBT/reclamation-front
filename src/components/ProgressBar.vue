<template>
  <div
    v-if="uploadProgress"
    class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-my-2 tw-gap-2"
  >
    <div
      class="tw-w-full tw-bg-[#e0e0e0] tw-h-6 tw-rounded tw-overflow-hidden"
    >
      <div
        class="tw-h-full tw-bg-[#4caf50] tw-flex tw-justify-end tw-items-center tw-rounded tw-text-white tw-px-2 tw-gap-3 tw-text-[1.03rem]"
        :style="{ width: uploadProgress.percentage + '%' }"
      >
        <label
          class="tw-font-bold"
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
