<script setup>
import { onMounted, ref } from 'vue';

defineProps([
  'modelValue',
  'placeholder',
  'type',
  'slot',
]);

defineEmits(['update:modelValue', 'showPassword']);

const input = ref(null);

onMounted(() => {
  if (input.value.hasAttribute('autofocus')) {
    input.value.focus();
  }
});
</script>

<template>

  <div class="tw-flex
              tw-border border-solid
              tw-rounded-lg
              tw-focus-within:ring-1
              tw-bg-white
              tw-focus:rounded-lg focus:outline-none">
    <input
      class="
                tw-w-full
                tw-px-3
                tw-py-2
                tw-text-sm
                tw-text-blue-login-410
                tw-placeholder-blue-login-410
                tw-font-normal
                tw-focus:ring-0
                tw-outline-none
                tw-ring-none
                tw-focus:ring-none
                tw-border-none
                tw-transition
                tw-ease-in-out
                tw-bg-white
                tw-rounded-lg
                tw-m-0
               "
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder ? placeholder : ''"
      :type="type"
      ref="input"
    >
    <slot />
  </div>
</template>
