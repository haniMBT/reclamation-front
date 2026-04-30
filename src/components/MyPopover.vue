<template>
  <Popover v-slot="{ open }" class="relative">
    <PopoverButton
      :class="open ? '' : 'text-opacity-90'"
      class="group inline-flex items-center rounded-full text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      <slot name="button"></slot>

    </PopoverButton>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
        class="absolute right-0 z-50 mt-2 w-screen max-w-sm transform px-4 sm:px-0 lg:max-w-3xl"
      >
        <div
          class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div
            class="bg-gray-50"
            :class="{'': headerWithBleu, 'p-4': !headerWithBleu}"
          >
            <slot name="content"></slot>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

const props = defineProps({
  headerWithBleu: {
    type: Boolean,
    default: false
  }
})
</script>
