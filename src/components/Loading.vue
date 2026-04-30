<template>
  <q-inner-loading
    :showing="loading"
    class="bg-gray-600 bg-opacity-10 bg-blur-xl"
  >
    <div
      class="flex flex-col justify-center items-center gap-4"
    >
      <q-spinner-ios
        size="xl"
        class="text-gray-600"
      />
      <label
        class="text-gray-600 font-bold"
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
