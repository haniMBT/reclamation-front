<template>
  <q-page class="flex flex-center">
    <div class="flex flex-col gap-4">
      <q-btn no-caps unelevated color="positive" @click="triggerPositive" label="Trigger 'positive'" />
      <q-btn no-caps unelevated color="negative" @click="triggerNegative" label="Trigger 'negative'" />
      <q-btn no-caps unelevated color="warning" text-color="dark" @click="triggerWarning" label="Trigger 'warning'" />
      <q-btn no-caps unelevated color="info" @click="triggerInfo" label="Trigger 'info'" />
      <q-btn @click="testApi" label="test api" />

      <q-btn label="Alert" color="primary" @click="alert = true" />
    </div>


    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {useQuasar} from "quasar";
import { api } from 'boot/axios'

const route = useRoute()
const {t} = useI18n()
const $q = useQuasar()

let alert = ref(false)


const props = defineProps({})

onMounted(async () => {
  console.log(111, route)
  console.log(222, t)
  console.log(333, $q)
  console.log(444, api)
})

async function testApi() {
  let a = await api.get('/test')
  console.log(555555555, a)
}
function triggerPositive() {
  $q.notify({
    type: 'positive',
    message: 'This is a "positive" type notification.'
  })
}
function triggerNegative () {
  $q.notify({
    type: 'negative',
    message: 'This is a "negative" type notification.'
  })
}
function triggerWarning () {
  $q.notify({
    type: 'warning',
    message: 'This is a "warning" type notification.'
  })
}
function triggerInfo () {
  $q.notify({
    type: 'info',
    message: 'This is a "info" type notification.'
  })
}


</script>
