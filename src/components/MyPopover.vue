<template>
  <Popover v-slot="{ open }" class="tw-relative">
    <PopoverButton
      :class="open ? '' : 'tw-text-opacity-90'"
      class="tw-group tw-inline-flex tw-items-center tw-rounded-full tw-text-base tw-font-medium tw-text-white tw-hover:text-opacity-100 tw-focus:outline-none tw-focus-visible:ring-2 tw-focus-visible:ring-white tw-focus-visible:ring-opacity-75"
    >
      <slot name="button"></slot>

    </PopoverButton>

    <transition
      enter-active-class="tw-transition tw-duration-200 tw-ease-out"
      enter-from-class="tw-translate-y-1 tw-opacity-0"
      enter-to-class="tw-translate-y-0 tw-opacity-100"
      leave-active-class="tw-transition tw-duration-150 tw-ease-in"
      leave-from-class="tw-translate-y-0 tw-opacity-100"
      leave-to-class="tw-translate-y-1 tw-opacity-0"
    >
      <PopoverPanel
        class="tw-absolute tw-right-0 tw-z-50 tw-mt-2 tw-w-screen tw-max-w-sm tw-transform tw-px-4 tw-sm:px-0 tw-lg:max-w-3xl"
      >
        <div
          class="tw-overflow-hidden tw-rounded-lg tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5"
        >
          <div
            class="tw-bg-gray-50"
            :class="{'': headerWithBleu, 'tw-p-4': !headerWithBleu}"
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
