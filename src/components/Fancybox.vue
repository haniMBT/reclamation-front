<script setup>
  import { onMounted } from 'vue'
  import { Fancybox } from '@fancyapps/ui'

  import '@fancyapps/ui/dist/fancybox/fancybox.css';

  const props = defineProps({
    options: Object,
  })

  onMounted(() => {
    const opts = {...props.options, closeButton: true, autoStart: true} || {}

    Fancybox.bind('[data-fancybox]', opts)

    return () => {
      Fancybox.destroy()
    }
  })
</script>

<template>
  <slot />
</template>