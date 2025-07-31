<template>
  <q-inner-loading
    :showing="loading"
    class="tw-bg-gray-600 tw-bg-opacity-10 tw-bg-blur-xl"
  >
    <div
      class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4"
    >
      <q-spinner-ios
        size="xl"
        class="tw-text-gray-600"
      />
      <label
        class="tw-text-gray-600 tw-font-bold"
      >
        En cours de chargement...
      </label>
    </div>
  </q-inner-loading>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>


<style scoped>

</style>
