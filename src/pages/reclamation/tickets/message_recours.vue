<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="message" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Messages Recours</h1>
            <div v-if="hasCurrentTicket">
              <p class="text-gray-600 text-sm"></p>
              <p class="text-blue-600 text-sm" v-if="createur">
                <q-icon name="person" size="sm" class="mr-1" />
                Créé par : {{ createur.nom_complet }}
              </p>
            </div>
            <p class="text-red-600 text-sm" v-else>
              Aucun ticket sélectionné .
            </p>
          </div>
        </div>
      </div>

      <!-- Réutiliser la logique de messages.vue -->
      <MessagesCore />
    </div>
  </div>
</template>

<script setup>
// Réutiliser la logique et les composants de messages.vue via un composant interne
// Pour garder le code DRY, on isole le coeur dans un composant inline.
import { defineAsyncComponent } from 'vue'
const MessagesCore = defineAsyncComponent(() => import('./messages.vue'))
</script>

<style scoped>
</style>