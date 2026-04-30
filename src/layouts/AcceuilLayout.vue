<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useMeta } from "quasar";

const metaData = {
  title: 'EPAL'
}

useMeta(metaData);
</script>
