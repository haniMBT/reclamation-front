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

  <div class="flex
              border border-solid
              rounded-lg
              focus-within:ring-1
              bg-white
              focus:rounded-lg focus:outline-none">
    <input
      class="
                w-full
                px-3
                py-2
                text-sm
                text-blue-login-410
                placeholder-blue-login-410
                font-normal
                focus:ring-0
                outline-none
                ring-none
                focus:ring-none
                border-none
                transition
                ease-in-out
                bg-white
                rounded-lg
                m-0
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
