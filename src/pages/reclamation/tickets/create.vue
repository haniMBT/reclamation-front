<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="confirmation_number" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Créer une réclamation</h1>
            <p class="text-gray-600 text-sm">Sélectionnez un type de ticket pour commencer</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <q-spinner-dots size="3rem" color="blue-6" />
        <span class="ml-3 text-gray-600">Chargement des tickets...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <q-icon name="error" class="text-red-500 mr-3" size="1.5rem" />
          <div>
            <h3 class="text-red-800 font-medium">Erreur de chargement</h3>
            <p class="text-red-600 text-sm mt-1">{{ error }}</p>
          </div>
        </div>
        <q-btn
          @click="fetchTickets"
          color="red-6"
          outline
          no-caps
          class="mt-4"
          icon="refresh"
        >
          Réessayer
        </q-btn>
      </div>

      <!-- Tickets Grid -->
      <div v-else-if="tickets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <q-card
          v-for="ticket in tickets"
          :key="ticket.id"
          class="bg-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <q-card-section class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ ticket.libelle }}</h3>
                <p class="text-gray-600 text-sm mb-3">
                  <q-icon name="business" size="sm" class="mr-1" />
                  Direction: {{ ticket.direction || 'Non spécifiée' }}
                </p>
              </div>
              <q-icon name="confirmation_number" class="text-blue-500" size="2rem" />
            </div>

            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="text-gray-700 text-sm leading-relaxed">
                <div v-if="ticket.definition && ticket.definition.length <= 200" v-html="ticket.definition"></div>
                <div v-else-if="ticket.definition">
                  <div v-html="ticket.definition.substring(0, 200) + '...'"></div>
                  <q-btn
                    @click.stop="showDefinitionModal(ticket)"
                    color="blue-6"
                    flat
                    no-caps
                    size="sm"
                    class="mt-2 p-0"
                  >
                    Voir plus
                  </q-btn>
                </div>
                <div v-else class="text-gray-500 italic">
                  Aucune définition disponible pour ce type de réclamation.
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-500">
                <q-icon name="info" size="sm" class="mr-1" />
                <span>{{ ticket.infos_generales?.length || 0 }} champ(s) requis</span>
              </div>
              <q-btn
                @click="selectTicket(ticket)"
                color="blue-6"
                no-caps
                unelevated
                class="px-6"
                icon="arrow_forward"
              >
                Sélectionner
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <q-icon name="confirmation_number" size="4rem" class="text-gray-300 mb-4" />
        <h3 class="text-xl font-medium text-gray-600 mb-2">Aucun ticket disponible</h3>
        <p class="text-gray-500">Il n'y a actuellement aucun type de ticket configuré.</p>
      </div>
    </div>

    <!-- Modal de formulaire dynamique -->
    <q-dialog v-model="showModal" persistent>
      <q-card class="w-full" style="min-width: 70vw; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-blue-50">
          <q-icon name="edit" class="text-blue-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-blue-900">{{ selectedTicket?.libelle }}</div>
            <div class="text-sm text-blue-700">Remplissez les informations de votre réclamation</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <!-- Bannière d'erreurs de validation -->
          <q-banner v-if="Object.keys(validationErrors).length > 0" class="bg-red-50 text-red-800 mb-6" rounded>
            <template #avatar>
              <q-icon name="error" color="red" />
            </template>
            <div class="font-medium mb-2">Erreurs de validation détectées</div>
            <div class="text-sm">
              Veuillez corriger les erreurs ci-dessous avant de soumettre le formulaire.
            </div>
          </q-banner>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <!-- Champs dynamiques basés sur les infos générales -->
              <div
                v-for="(info, index) in selectedTicket?.infos_generales"
                :key="info.id"
                class="space-y-2"
              >
                <label class="block text-sm font-medium text-gray-700">
                  {{ info.libelle }}
                  <span v-if="info.key_attirubut" class="text-red-500">*</span>
                  <q-icon v-if="info.key_attirubut" name="star" class="text-amber-500 ml-1" size="sm" />
                </label>
                <q-input
                  v-model="formData[info.libelle]"
                  outlined
                  dense
                  :placeholder="`Entrez ${info.libelle.toLowerCase()}`"
                  :rules="info.key_attirubut ? [val => !!val || `${info.libelle} est requis`] : []"
                  :error="!!validationErrors[info.libelle]"
                  @input="clearFieldError(info.libelle)"
                >
                  <template #prepend>
                    <q-icon name="edit" class="text-blue-600" />
                  </template>
                </q-input>
                <!-- Erreurs pour les champs dynamiques -->
                <div v-if="validationErrors[`info_general_data.${index}.value`] || validationErrors[info.libelle]" class="text-red-600 text-xs mt-1">
                  <div v-for="error in getFieldErrors(`info_general_data.${index}.value`, info.libelle)" :key="error" class="flex items-start mb-1">
                    <q-icon name="error_outline" size="12px" class="mr-1 mt-0.5 flex-shrink-0" />
                    <span>{{ error }}</span>
                  </div>
                </div>
              </div>


            </div>
          </form>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn
            @click="closeModal"
            color="grey-6"
            outline
            no-caps
            class="px-6"
          >
            Annuler
          </q-btn>
          <q-btn
            @click="submitForm"
            color="blue-6"
            no-caps
            unelevated
            class="px-6 ml-3"
            :loading="submitting"
          >
            Soumettre la réclamation
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal d'alerte pour les doublons -->
    <q-dialog v-model="showDuplicateModal" persistent>
      <q-card class="w-full" style="min-width: 500px; max-width: 600px;">
        <q-card-section class="flex items-center bg-amber-50">
          <q-icon name="warning" class="text-amber-600 mr-3" size="2.5rem" />
          <div>
            <div class="text-xl font-semibold text-amber-900">Réclamation similaire détectée</div>
            <div class="text-sm text-amber-700">Une vérification est nécessaire avant de continuer</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div class="flex items-start">
              <q-icon name="info" class="text-amber-600 mr-3 mt-1" size="1.2rem" />
              <div>
                <h4 class="font-medium text-amber-900 mb-2">Information importante</h4>
                <p class="text-amber-800 text-sm leading-relaxed">
                  {{ duplicateMessage }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <h5 class="font-medium text-gray-900 mb-2">Que souhaitez-vous faire ?</h5>
            <ul class="text-sm text-gray-700 space-y-1">
              <li class="flex items-center">
                <q-icon name="visibility" class="text-blue-500 mr-2" size="sm" />
                <strong>Suivre :</strong> Consulter la réclamation existante
              </li>
              <li class="flex items-center">
                <q-icon name="cancel" class="text-gray-500 mr-2" size="sm" />
                <strong>Annuler :</strong> Revenir au formulaire pour modifier vos informations
              </li>
            </ul>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn
            @click="closeDuplicateModal"
            color="grey-6"
            outline
            no-caps
            class="px-6"
            icon="cancel"
          >
            Annuler
          </q-btn>
          <q-btn
            @click="proceedWithDuplicate"
            color="blue-6"
            no-caps
            unelevated
            class="px-6 ml-3"
            icon="visibility"
          >
            Suivre
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de définition complète -->
    <q-dialog v-model="showDefinitionModalRef" persistent>
      <q-card class="w-full" style="min-width: 60vw; max-width: 80vw; max-height: 80vh;">
        <q-card-section class="flex items-center bg-blue-50">
          <q-icon name="info" class="text-blue-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-blue-900">{{ selectedDefinitionTicket?.libelle }}</div>
            <div class="text-sm text-blue-700">Définition complète</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <div class="text-gray-700 leading-relaxed" v-html="selectedDefinitionTicket?.definition"></div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn
            @click="closeDefinitionModal"
            color="blue-6"
            no-caps
            unelevated
            class="px-6"
          >
            Fermer
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { useTicketStore } from 'src/stores/ticket'


// Composables
const $q = useQuasar()
const router = useRouter()
const ticketStore = useTicketStore()

// State
const tickets = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const selectedTicket = ref(null)
const submitting = ref(false)
const formData = reactive({})
const showDuplicateModal = ref(false)
const duplicateMessage = ref('')
const validationErrors = ref({})
const showDefinitionModalRef = ref(false)
const selectedDefinitionTicket = ref(null)

// Methods
const fetchTickets = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get('/api/rec/tickets')

    if (response.data.success) {
      tickets.value = response.data.data
    } else {
      throw new Error(response.data.message || 'Erreur lors du chargement des tickets')
    }
  } catch (err) {
    console.error('Erreur lors du fetch des tickets:', err)
    error.value = err.response?.data?.message || err.message || 'Erreur de connexion'

    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement des tickets',
      caption: error.value
    })
  } finally {
    loading.value = false
  }
}

const selectTicket = (ticket) => {
  selectedTicket.value = ticket

  // Initialiser le formulaire avec les champs dynamiques
  Object.keys(formData).forEach(key => delete formData[key])

  // Ajouter les champs basés sur les infos générales
  ticket.infos_generales?.forEach(info => {
    formData[info.libelle] = ''
  })

  // Réinitialiser les erreurs de validation à l'ouverture du modal
  validationErrors.value = {}

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTicket.value = null
  Object.keys(formData).forEach(key => delete formData[key])
  validationErrors.value = {}
}

const clearFieldError = (fieldName) => {
  if (validationErrors.value[fieldName]) {
    delete validationErrors.value[fieldName]
  }
}

const getFieldErrors = (backendFieldName, frontendFieldName) => {
  const errors = []

  // Vérifier les erreurs avec le nom du backend
  if (validationErrors.value[backendFieldName]) {
    const backendErrors = Array.isArray(validationErrors.value[backendFieldName])
      ? validationErrors.value[backendFieldName]
      : [validationErrors.value[backendFieldName]]
    errors.push(...backendErrors)
  }

  // Vérifier les erreurs avec le nom du frontend
  if (validationErrors.value[frontendFieldName]) {
    const frontendErrors = Array.isArray(validationErrors.value[frontendFieldName])
      ? validationErrors.value[frontendFieldName]
      : [validationErrors.value[frontendFieldName]]
    errors.push(...frontendErrors)
  }

  return errors
}



const submitForm = async () => {
  // Réinitialiser les erreurs de validation
  validationErrors.value = {}

  // Validation des champs requis
  const requiredFields = selectedTicket.value?.infos_generales?.filter(info => info.key_attirubut) || []

  for (const field of requiredFields) {
    if (!formData[field.libelle]) {
      $q.notify({
        type: 'negative',
        message: `Le champ "${field.libelle}" est requis`
      })
      return
    }
  }



  submitting.value = true

  try {
    // Préparer les données pour l'API
    const info_general_data = selectedTicket.value?.infos_generales?.map(info => ({
      info_general_id: info.id,
      value: formData[info.libelle] || '',
      key_attribut: info.key_attirubut || false
    })) || []

    const payload = {
       bticket_id: selectedTicket.value.id,
       user_id: 1, // À remplacer par l'ID de l'utilisateur connecté
       direction: 'ENTRANT', // À adapter selon vos besoins
       status: 'OUVERT',
       info_general_data: info_general_data
     }

    // Appeler l'API de vérification de doublons
    const response = await api.post('/api/rec/tickets/check-duplicate', payload)

    if (response.data.duplicate_found) {
      duplicateMessage.value = response.data.message
      showDuplicateModal.value = true
      submitting.value = false
      return
    }

    // Succès - réclamation créée (statut 201)
    if (response.status === 201 && response.data.success) {
      // Sauvegarder les données dans le store
      const saveResult = ticketStore.saveTicket(response.data.data)
      
      if (saveResult.success) {
        $q.notify({
          type: 'positive',
          message: 'Réclamation créée avec succès',
          caption: 'Redirection vers la suite du processus...'
        })

        closeModal()
        
        // Rediriger vers create2.vue
         setTimeout(() => {
           router.push('/reclamations/ticket2')
         }, 1000)
      } else {
        $q.notify({
          type: 'negative',
          message: 'Erreur lors de la sauvegarde',
          caption: saveResult.error
        })
      }
    } else {
      $q.notify({
        type: 'positive',
        message: 'Réclamation créée avec succès',
        caption: 'Votre demande sera traitée dans les meilleurs délais'
      })
      closeModal()
    }
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    console.log('Response data:', error.response?.data)
    console.log('Response status:', error.response?.status)

    // Gestion des erreurs de validation (422)
    if (error.response && error.response.status === 422) {
      // Laravel renvoie les erreurs dans response.data.errors
      validationErrors.value = error.response.data.errors || {}

      console.log('Erreurs de validation extraites:', validationErrors.value)

      // Compter le nombre total d'erreurs
      const errorCount = Object.keys(validationErrors.value).length

      $q.notify({
        type: 'negative',
        message: `${errorCount} erreur${errorCount > 1 ? 's' : ''} de validation détectée${errorCount > 1 ? 's' : ''}`,
        caption: 'Veuillez corriger les erreurs affichées dans le formulaire',
        timeout: 5000
      })
    } else {
      // Réinitialiser les erreurs de validation pour les autres types d'erreurs
      validationErrors.value = {}

      $q.notify({
        type: 'negative',
        message: 'Erreur lors de la soumission',
        caption: error.response?.data?.message || error.message
      })
    }
  } finally {
    submitting.value = false
  }
}

const closeDuplicateModal = () => {
  showDuplicateModal.value = false
  duplicateMessage.value = ''
}

const proceedWithDuplicate = () => {
  // Pour l'instant, ne fait rien comme demandé
  closeDuplicateModal()
  $q.notify({
    type: 'info',
    message: 'Fonctionnalité en cours de développement',
    caption: 'Le suivi des doublons sera bientôt disponible'
  })
}

const showDefinitionModal = (ticket) => {
  selectedDefinitionTicket.value = ticket
  showDefinitionModalRef.value = true
}

const closeDefinitionModal = () => {
  showDefinitionModalRef.value = false
  selectedDefinitionTicket.value = null
}

// Lifecycle
onMounted(() => {
  fetchTickets()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
