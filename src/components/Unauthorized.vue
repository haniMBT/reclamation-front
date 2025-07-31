<template>
  <div
    class="tw-relative tw-bg-white tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full tw-flex-grow-1 tw-bg-[url('/unauthorized/background.svg')] tw-bg-cover tw-bg-no-repeat"
    style="background-image:linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.5)), url(/unauthorized/background.svg)"
  >
    <q-img
      class="tw-absolute tw-top-[25%] -tw-right-12 tw-h-32 xl:tw-h-48 2xl:tw-h-64 tw-w-32 xl:tw-w-48 2xl:tw-w-64"
      src="/unauthorized/square_1.svg"
    />
    <q-img
      class="tw-absolute -tw-bottom-8 tw-left-[20%] tw-h-32 xl:tw-h-48 2xl:tw-h-64 tw-w-32 xl:tw-w-48 2xl:tw-w-64"
      src="/unauthorized/square_2.svg"
    />
    <q-img
      class="tw-h-48 xl:tw-h-72 2xl:tw-h-96 tw-w-48 xl:tw-w-72 2xl:tw-w-96"
      src="/unauthorized/icon.png"
    />
    <div
      class="tw-absolute tw-w-full tw-top-8 tw-left-8 tw-text-white tw-flex tw-flex-col tw-gap-4"
    >
      <label
        class="tw-text-white tw-text-[30px] xl:tw-text-[40px] 2xl:tw-text-[50px]"
      >
        {{ title }}
      </label>
      <label
        class="tw-text-white tw-text-[15px] xl:tw-text-[20px] 2xl:tw-text-[25px]"
      >
        {{ content }}
      </label>
    </div>
  </div>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    default: 'Accès Non Autorisé !'
  },
  content: {
    type: String,
    default: 'Vous n\'avez pas les privilèges pour consulter cette page.'
  },
})

</script>

<style scoped>

</style>
