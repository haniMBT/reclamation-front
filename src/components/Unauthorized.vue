<template>
  <div
    class="relative bg-white flex flex-col justify-center items-center w-full flex-grow-1 bg-[url('/unauthorized/background.svg')] bg-cover bg-no-repeat"
    style="background-image:linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.5)), url(/unauthorized/background.svg)"
  >
    <q-img
      class="absolute top-[25%] -right-12 h-32 xl:h-48 2xl:h-64 w-32 xl:w-48 2xl:w-64"
      src="/unauthorized/square_1.svg"
    />
    <q-img
      class="absolute -bottom-8 left-[20%] h-32 xl:h-48 2xl:h-64 w-32 xl:w-48 2xl:w-64"
      src="/unauthorized/square_2.svg"
    />
    <q-img
      class="h-48 xl:h-72 2xl:h-96 w-48 xl:w-72 2xl:w-96"
      src="/unauthorized/icon.png"
    />
    <div
      class="absolute w-full top-8 left-8 text-white flex flex-col gap-4"
    >
      <label
        class="text-white text-[30px] xl:text-[40px] 2xl:text-[50px]"
      >
        {{ title }}
      </label>
      <label
        class="text-white text-[15px] xl:text-[20px] 2xl:text-[25px]"
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
