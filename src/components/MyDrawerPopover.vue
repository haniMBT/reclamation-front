<template>
  <transition
    enter-active-class="tw-transition tw-duration-200 tw-ease-out"
    enter-from-class="tw-translate-y-1 tw-opacity-0"
    enter-to-class="tw-translate-y-0 tw-opacity-100"
    leave-active-class="tw-transition tw-duration-150 tw-ease-in"
    leave-from-class="tw-translate-y-0 tw-opacity-100"
    leave-to-class="tw-translate-y-1 tw-opacity-0"
  >
    <slot name="content"></slot>
  </transition>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

</script>
