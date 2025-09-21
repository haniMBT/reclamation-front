<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="task_alt" size="2rem" class="text-green-600 mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-1">Réclamation créée avec succès</h1>
              <p class="text-gray-600 text-sm">Récapitulatif de votre demande</p>
            </div>
          </div>
          <q-btn
            @click="goBack"
            color="grey-6"
            outline
            no-caps
            icon="arrow_back"
            class="px-4"
          >
            Retour
          </q-btn>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <q-spinner-dots size="3rem" color="blue-6" />
        <span class="ml-3 text-gray-600">Chargement des informations...</span>
      </div>

      <!-- Error State - Redirection -->
      <div v-else-if="!hasValidTicket" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="error" class="text-red-500 mr-3" size="1.5rem" />
          <div>
            <h3 class="text-red-800 font-medium">Aucune réclamation trouvée</h3>
            <p class="text-red-600 text-sm mt-1">Vous devez d'abord créer une réclamation.</p>
          </div>
        </div>
        <q-btn
          @click="redirectToCreate"
          color="red-6"
          no-caps
          unelevated
          class="px-6"
          icon="add"
        >
          Créer une réclamation
        </q-btn>
      </div>

      <!-- Success State - Ticket Summary -->
      <div v-else class="space-y-6">
        <!-- Ticket Information Card -->
        <q-card class="bg-white shadow-sm">
          <q-card-section class="p-6">
            <div class="flex items-center mb-4">
              <q-icon name="confirmation_number" class="text-blue-600 mr-3" size="1.5rem" />
              <h2 class="text-xl font-semibold text-gray-800">Informations du ticket</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <label class="text-sm font-medium text-gray-600 block mb-1">ID du ticket</label>
                  <p class="text-lg font-semibold text-gray-800">#{{ ticketInfo.t_rec_ticket_id }}</p>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                  <label class="text-sm font-medium text-gray-600 block mb-1">Type de ticket</label>
                  <p class="text-lg font-semibold text-gray-800">#{{ ticketInfo.b_rec_ticket_id }}</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <label class="text-sm font-medium text-gray-600 block mb-1">Statut</label>
                  <q-badge color="green" class="px-3 py-1">
                    {{ ticketInfo.ticketData?.status || 'OUVERT' }}
                  </q-badge>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                  <label class="text-sm font-medium text-gray-600 block mb-1">Direction</label>
                  <p class="text-lg font-semibold text-gray-800">{{ ticketInfo.ticketData?.direction || 'ENTRANT' }}</p>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Description Card -->
        <q-card class="bg-white shadow-sm">
          <q-card-section class="p-6">
            <div class="flex items-center mb-4">
              <q-icon name="description" class="text-blue-600 mr-3" size="1.5rem" />
              <h2 class="text-xl font-semibold text-gray-800">Description</h2>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-800 leading-relaxed">
                {{ ticketInfo.ticketData?.description || 'Aucune description fournie' }}
              </p>
            </div>
          </q-card-section>
        </q-card>

        <!-- Additional Information Card -->
        <q-card v-if="ticketInfo.ticketData?.info_general_data?.length > 0" class="bg-white shadow-sm">
          <q-card-section class="p-6">
            <div class="flex items-center mb-4">
              <q-icon name="info" class="text-blue-600 mr-3" size="1.5rem" />
              <h2 class="text-xl font-semibold text-gray-800">Informations complémentaires</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="(info, index) in ticketInfo.ticketData.info_general_data" 
                :key="index"
                class="bg-gray-50 p-4 rounded-lg"
              >
                <label class="text-sm font-medium text-gray-600 block mb-1">
                  Information {{ index + 1 }}
                  <q-badge v-if="info.key_attribut" color="orange" class="ml-2">Requis</q-badge>
                </label>
                <p class="text-gray-800 font-medium">{{ info.value || 'Non renseigné' }}</p>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Actions Card -->
        <q-card class="bg-white shadow-sm">
          <q-card-section class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-1">Que souhaitez-vous faire maintenant ?</h3>
                <p class="text-gray-600 text-sm">Choisissez une action pour continuer</p>
              </div>
              
              <div class="flex space-x-3">
                <q-btn
                  @click="createNewTicket"
                  color="blue-6"
                  outline
                  no-caps
                  icon="add"
                  class="px-6"
                >
                  Nouvelle réclamation
                </q-btn>
                
                <q-btn
                  @click="viewTickets"
                  color="green-6"
                  no-caps
                  unelevated
                  icon="list"
                  class="px-6"
                >
                  Voir mes réclamations
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useTicketStore } from 'src/stores/ticket'

// Composables
const router = useRouter()
const $q = useQuasar()
const ticketStore = useTicketStore()

// State
const loading = ref(true)

// Computed
const hasValidTicket = computed(() => {
  return ticketStore.hasTicket
})

const ticketInfo = computed(() => {
  return ticketStore.getTicketInfo
})

// Methods
const initializePage = async () => {
  loading.value = true
  
  try {
    // Initialiser les données depuis le LocalStorage
    const initResult = ticketStore.initializeFromStorage()
    
    if (!initResult.success) {
      console.error('Erreur lors de l\'initialisation:', initResult.error)
    }
    
    // Vérifier si nous avons un ticket valide
    if (!hasValidTicket.value) {
      console.log('Aucun ticket trouvé, redirection nécessaire')
      // La redirection sera gérée par le template
    } else {
      console.log('Ticket trouvé:', ticketInfo.value)
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la page:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement',
      caption: error.message
    })
  } finally {
    loading.value = false
  }
}

const redirectToCreate = () => {
  $q.notify({
    type: 'info',
    message: 'Redirection vers la création de réclamation',
    caption: 'Vous allez être redirigé...'
  })
  
  setTimeout(() => {
    router.push('/reclamations/ticket')
  }, 1000)
}

const goBack = () => {
  router.go(-1)
}

const createNewTicket = () => {
  // Nettoyer les données du ticket actuel
  ticketStore.clearTicket()
  
  $q.notify({
    type: 'info',
    message: 'Création d\'une nouvelle réclamation',
    caption: 'Redirection en cours...'
  })
  
  setTimeout(() => {
    router.push('/reclamations/ticket')
  }, 1000)
}

const viewTickets = () => {
  $q.notify({
    type: 'info',
    message: 'Affichage de vos réclamations',
    caption: 'Redirection en cours...'
  })
  
  setTimeout(() => {
    router.push('/reclamations/client')
  }, 1000)
}

// Lifecycle
onMounted(() => {
  initializePage()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>