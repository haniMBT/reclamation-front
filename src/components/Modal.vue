<template>
  <teleport to="body">
    <transition leave-active-class="tw-duration-200">
      <div v-show="show"
        class="tw-flex tw-justify-center tw-items-center tw-fixed tw-inset-0 tw-overflow-y-auto tw-px-4 tw-py-6 tw-sm:px-0 tw-z-50"
        scroll-region>
        <transition enter-active-class="tw-ease-out tw-duration-300" enter-from-class="tw-opacity-0"
          enter-to-class="tw-opacity-100" leave-active-class="tw-ease-in tw-duration-200"
          leave-from-class="tw-opacity-100" leave-to-class="tw-opacity-0">
          <div v-show="show" class="tw-fixed tw-inset-0 tw-transform tw-transition-all" @click.self="close">
            <div class="tw-absolute tw-inset-0 tw-bg-gray-800 tw-bg-opacity-90" />
          </div>
        </transition>
        <transition enter-active-class="tw-ease-out tw-duration-300"
          enter-from-class="tw-opacity-0 tw-translate-y-4 tw-sm:translate-y-0 tw-sm:scale-95"
          enter-to-class="tw-opacity-100 tw-translate-y-0 tw-sm:scale-100" leave-active-class="tw-ease-in tw-duration-200"
          leave-from-class="tw-opacity-100 tw-translate-y-0 tw-sm:scale-100"
          leave-to-class="tw-opacity-0 tw-translate-y-4 tw-sm:translate-y-0 tw-sm:scale-95">
          <div v-show="show"
            class="tw-my-6 tw-bg-white tw-h-fit tw-w-full tw-rounded-lg tw-overflow-auto tw-shadow-xl tw-transform tw-transition-all tw-sm:w-full tw:mx-auto"
            :class="maxWidthClass"
               :style="maxSizeStyle">
            <div class="tw-flex tw-w-full tw-my-4 tw-pb-2 tw-border-b">
              <label class="tw-mx-4 tw-text-xl">
                {{ props.title }}
              </label>
              <div class="tw-fixed tw-flex  tw-p-1 tw-right-4 tw-cursor-pointer">
                <template v-if="allowGrowth">
                  <svg v-if="isFullscreen" @click="toggelFullScreen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="tw-w-6 tw-h-6 tw-mr-2 hover:tw-bg-gray-400 hover:tw-bg-opacity-25 hover:tw-rounded-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                  </svg>
                  <svg v-else @click="toggelFullScreen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="tw-w-6 tw-h-6 tw-mr-2 hover:tw-bg-gray-400 hover:tw-bg-opacity-25 hover:tw-rounded-full">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </template>
                <svg @click="close" class="tw-w-6 tw-h-6 hover:tw-bg-gray-400 hover:tw-bg-opacity-25 hover:tw-rounded-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div class="tw-flex tw-flex-col tw-mx-4 tw-my-4">
              <div class="tw-overflow-auto" :style="{ 'max-height': $q.screen.height * 0.6 + 'px' }">
                <slot v-if="show" />
              </div>
              <q-separator v-if="withFooter" class="tw-my-4" />
              <div v-if="withFooter" class="tw-flex tw-justify-end tw-items-end tw-gap-4">
                <q-btn v-if="secondaryBtnText" :disable="ConsultationMode" :icon="secondaryIcon" :color="secondaryBtnColor"
                  :text-color="secondaryTextColor" no-caps @click="clickSecondaryBtn" :label="secondaryBtnText" />
                <q-btn v-if="primaryBtnText" :icon="primaryIcon" :color="primaryBtnColor" :text-color="primaryTextColor"
                  no-caps @click="clickPrimaryBtn" :disable="ConsultationMode" :label="primaryBtnText" :disabled="primaryBtnDisabled"
                  :loading="primaryLoading" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import {computed, onMounted, onUnmounted, reactive, ref, watch} from 'vue';
import { useQuasar } from "quasar";
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  minWidth: {
    type: String,
    default: 'lg',
  },
  maxWidth: {
    type: String,
    default: '2xl',
  },
  closeable: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Title'
  },
  primaryLoading: {
    type: Boolean,
    default: false
  },
  secondaryLoading: {
    type: Boolean,
    default: false
  },
  primaryBtnText: {
    type: String,
    default: 'Primary'
  },
  primaryBtnDisabled: {
    type: Boolean,
    default: false
  },
  secondaryBtnText: {
    type: String,
    default: 'Secondary'
  },
  primaryBtnColor: {
    type: String,
    default: 'green'
  },
  secondaryBtnColor: {
    type: String,
    default: 'yellow'
  },
  primaryTextColor: {
    type: String,
    default: 'white'
  },
  secondaryTextColor: {
    type: String,
    default: 'black'
  },
  primaryIcon: {
    type: String,
    default: 'search'
  },
  secondaryIcon: {
    type: String,
    default: 'autorenew'
  },
  withFooter: {
    type: Boolean,
    default: true,
  },
  allowGrowth: {
    type: Boolean,
    default: false,
  },
  ConsultationMode: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits([
  'close',
  'click-primary-btn',
  'click-secondary-btn',
]);
watch(
  () => props.show,
  () => {
    if (props.show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = null;
    }
  }
);

const clickSecondaryBtn = () => {
  emits('click-secondary-btn')
}
const clickPrimaryBtn = () => {
  emits('click-primary-btn')
}

const close = () => {
  if (props.closeable) {
    emits('close');
  }
};
const closeOnEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    close();
  }
};

const $q = useQuasar()
onMounted(() => {
  document.addEventListener('keydown', closeOnEscape)
});
onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape);
  document.body.style.overflow = null;
});

const sizes = reactive({
  sm: 'sm:tw-max-w-sm',
  md: 'sm:tw-max-w-md',
  lg: 'sm:tw-max-w-lg',
  xl: 'sm:tw-max-w-xl',
  '2xl': 'sm:tw-max-w-2xl',
  '3xl': 'sm:tw-max-w-3xl',
  '4xl': 'sm:tw-max-w-4xl',
  '5xl': 'sm:tw-max-w-5xl',
  '6xl': 'sm:tw-max-w-6xl',
  '7xl': 'sm:tw-max-w-7xl',
  '8xl': 'sm:tw-max-w-8xl',
  '9xl': 'sm:tw-max-w-9xl',
  '10xl': 'sm:tw-max-w-10xl',
})

const maxWidthClass = computed(() => {
  return sizes[props.maxWidth];
});
const minWidthClass = computed(() => {
  return sizes[props.minWidth];
});

const toggelFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
}

const isFullscreen = ref(false);

const maxSizeStyle = computed(() => {
  return isFullscreen.value ? 'width: 95% !important; height: 95% !important; max-width: revert !important;' : '';
});
</script>
