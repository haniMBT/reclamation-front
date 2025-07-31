<script setup>
defineProps({
  type: {
    type: String,
    default: 'submit',
  },
});
</script>

<template>
  <button :type="type" class="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-bg-blue-login-430 tw-border tw-border-transparent tw-rounded-md tw-font-semibold tw-text-xs tw-text-white tw-tracking-widest hover:tw-bg-gray-700 active:tw-bg-gray-900 focus:tw-outline-none focus:tw-border-gray-900 focus:tw-shadow-outline-gray tw-transition tw-ease-in-out tw-duration-150">
    <slot />
  </button>
</template>
