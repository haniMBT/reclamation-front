<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="edit_document" size="2rem" class="text-blue-600 mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-1">Compléter votre réclamation</h1>
              <p class="text-gray-600 text-sm">Remplissez les informations complémentaires pour finaliser votre réclamation</p>
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

      <!-- Main Form -->
      <div v-else class="bg-white rounded-lg shadow-sm p-6">
        <q-form @submit="submitForm" class="q-gutter-md">
          <!-- Types et détails sous forme de checkboxes -->
           <div v-if="ticketTypes.length > 0" class="mb-6">
             <label class="block text-sm font-medium text-gray-700 mb-2">
               Type(s) de réclamation *
             </label>

             <div class="space-y-4">
               <div v-for="type in ticketTypes" :key="type.id" class="border border-gray-200 rounded-lg p-4">
                 <div class="flex items-start space-x-3">
                   <q-checkbox
                     v-model="form.selectedTypes[type.id]"
                     color="blue-6"
                     class="mt-1"
                   />
                   <div class="flex-1">
                     <label class="font-medium text-gray-800 cursor-pointer" @click="form.selectedTypes[type.id] = !form.selectedTypes[type.id]">
                       {{ type.name }}
                     </label>

                     <div v-if="type.description" class="text-sm text-gray-600 mt-1">
                       {{ type.description }}
                     </div>

                     <!-- Détails conditionnels quand le type est sélectionné -->
                     <div v-if="form.selectedTypes[type.id]" class="mt-3 ml-4 space-y-2">
                       <!-- Détails sous forme de checkboxes -->
                       <div v-if="type.details && type.details.length > 0">
                         <div class="text-sm font-medium text-gray-600 mb-2">Détails :</div>
                         <div v-for="detail in type.details" :key="detail.id" class="flex items-center space-x-2">
                           <q-checkbox
                             :model-value="form.typeDetails[type.id]?.details?.includes(detail.id) || false"
                             @update:model-value="toggleDetail(type.id, detail.id, $event)"
                             color="green-6"
                             size="sm"
                           />
                           <label class="text-sm text-gray-700 cursor-pointer" @click="toggleDetail(type.id, detail.id, !form.typeDetails[type.id]?.details?.includes(detail.id))">
                             {{ detail.label }}
                           </label>
                         </div>
                       </div>

                       <!-- Champ "Autre (précisez)" -->
                       <div class="mt-3">
                         <label class="block text-sm font-medium text-gray-600 mb-2">
                           Autre (précisez) :
                         </label>
                         <q-input
                           v-model="form.typeDetails[type.id].autre"
                           type="textarea"
                           outlined
                           dense
                           rows="2"
                           placeholder="Précisez votre demande..."
                           class="w-full"
                         >
                           <template v-slot:prepend>
                             <q-icon name="edit_note" class="text-purple-600" />
                           </template>
                         </q-input>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <!-- Validation error pour les types -->
             <div v-if="errors.types" class="text-red-600 text-xs mt-1">
               {{ errors.types }}
             </div>
           </div>

          <!-- Description détaillée -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description détaillée *
            </label>
            <q-editor
              v-model="form.description"
              min-height="250px"
              placeholder="Décrivez en détail votre réclamation..."
              :toolbar="[
                ['bold', 'italic', 'underline', 'strike'],
                ['quote', 'unordered', 'ordered'],
                ['undo', 'redo'],
                ['fullscreen']
              ]"
              class="border rounded-md"
            />
            <div v-if="errors.description" class="text-red-600 text-xs mt-1">
              {{ errors.description }}
            </div>
          </div>

          <!-- Documents à fournir Section -->
          <div v-if="ticketData.documentAFournir" class="mb-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start">
                <q-icon name="description" class="text-blue-600 mr-3 mt-0.5" />
                <div class="text-sm text-blue-800">
                  <p class="font-medium mb-2">Documents à fournir :</p>
                  <div class="text-blue-700" v-html="ticketData.documentAFournir"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fichiers joints -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fichiers joints (optionnel)
            </label>

            <!-- Zone d'ajout de fichiers -->
            <div class="flex gap-3 mb-3">
              <q-file
                v-model="newFiles"
                multiple
                outlined
                dense
                accept="image/*,application/pdf,.doc,.docx,.txt"
                max-file-size="10485760"
                class="flex-1"
                @rejected="onRejected"
                @update:model-value="onNewFilesSelected"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" class="text-blue-600" />
                </template>
                <template v-slot:hint>
                  Formats acceptés: Images, PDF, Word. Taille max: 10Mo par fichier
                </template>
              </q-file>

              <q-btn
                label="Ajouter"
                color="blue-6"
                outline
                :disable="!newFiles || newFiles.length === 0"
                @click="addFiles"
                class="px-4"
              >
                <q-icon name="add" class="mr-1" />
              </q-btn>
            </div>

            <!-- Liste des fichiers sélectionnés -->
            <div v-if="form.files.length > 0" class="mt-3">
              <div class="text-sm font-medium text-gray-700 mb-2">
                Fichiers sélectionnés ({{ form.files.length }}) :
              </div>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in form.files"
                  :key="index"
                  class="flex items-center justify-between bg-gray-50 p-3 rounded-md border"
                >
                  <div class="flex items-center">
                    <q-icon
                      :name="getFileIcon(file.type)"
                      size="1.5rem"
                      class="text-blue-600 mr-3"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-800">{{ file.name }}</div>
                      <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                    </div>
                  </div>
                  <q-btn
                    icon="close"
                    size="sm"
                    flat
                    round
                    color="negative"
                    @click="removeFile(index)"
                    class="ml-2"
                  >
                    <q-tooltip>Supprimer le fichier</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-between items-center pt-6 border-t border-gray-200">
            <q-btn
              label="Annuler"
              color="grey-6"
              flat
              @click="goBack"
              class="px-6"
            />
            <q-btn
              label="Finaliser la réclamation"
              color="blue-6"
              type="submit"
              :loading="isSubmitting"
              :disable="!isFormValid"
              class="px-8"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
              <q-icon name="send" class="ml-2" />
            </q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useTicketStore } from 'src/stores/ticket'
import { api } from 'boot/axios'

// Composables
const router = useRouter()
const $q = useQuasar()
const ticketStore = useTicketStore()

// State
const loading = ref(true)
const loadingTicketData = ref(false)
const isSubmitting = ref(false)
const ticketData = ref({})
const ticketTypes = ref([])
const newFiles = ref(null)
const errors = ref({})

// Form data
const form = ref({
  description: '',
  selectedTypes: {}, // Types sélectionnés (id => boolean)
  typeDetails: {}, // Structure: { type_id: { details: [detail_ids], autre: 'texte' } }
  files: []
})

// Computed
const hasValidTicket = computed(() => {
  return ticketStore.hasTicket
})

const ticketInfo = computed(() => {
  return ticketStore.getTicketInfo
})

const documentAFournir = computed(() => {
  return ticketData.value?.documentAFournir || ''
})

// Watcher pour initialiser typeDetails quand selectedTypes change
watch(() => form.value.selectedTypes, (newSelectedTypes) => {
  Object.keys(newSelectedTypes).forEach(typeId => {
    if (newSelectedTypes[typeId] && !form.value.typeDetails[typeId]) {
      form.value.typeDetails[typeId] = { details: [], autre: '' }
    }
  })
}, { deep: true })

const isFormValid = computed(() => {
  // Vérifier que la description est remplie
  if (!form.value.description || form.value.description.trim() === '') {
    return false
  }

  // Vérifier qu'au moins un type est sélectionné
  const hasSelectedType = Object.values(form.value.selectedTypes).some(selected => selected)
  if (!hasSelectedType) {
    return false
  }

  return true
})

// Methods
const getFieldClass = (fieldType) => {
  // Retourne les classes CSS appropriées selon le type de champ
  switch (fieldType) {
    case 'textarea':
      return 'col-12'
    case 'checkbox':
      return 'col-12'
    default:
      return 'col-12 col-md-6'
  }
}

const loadCompleteTicketData = async () => {
  if (!hasValidTicket.value) {
    console.warn('Aucun ticket valide pour charger les données')
    return
  }

  loadingTicketData.value = true
  try {
    const result = await ticketStore.getCompleteTicketData(ticketInfo.value.b_rec_ticket_id)

    if (result.success) {
      ticketData.value = result.data.ticket
      ticketTypes.value = result.data.types

      // Initialiser les champs du formulaire avec les données du ticket
      initializeFormFromTicketData()

      console.log('Données complètes du ticket chargées:', result.data)
    } else {
      $q.notify({
        type: 'negative',
        message: result.error || 'Erreur lors du chargement des données du ticket',
        position: 'top'
      })
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données du ticket:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement des données du ticket',
      position: 'top'
    })
  } finally {
    loadingTicketData.value = false
  }
}

// Initialiser le formulaire avec les données du ticket
const initializeFormFromTicketData = () => {
  if (!ticketData.value) return

  // Initialiser les types sélectionnés et leurs structures de données
  ticketTypes.value.forEach(type => {
    if (!form.value.selectedTypes.hasOwnProperty(type.id)) {
      form.value.selectedTypes[type.id] = false
    }
    if (!form.value.typeDetails[type.id]) {
      form.value.typeDetails[type.id] = {
        details: [],
        autre: ''
      }
    }
  })
}

// Fonction pour gérer la sélection/désélection des détails
const toggleDetail = (typeId, detailId, isSelected) => {
  // S'assurer que la structure existe
  if (!form.value.typeDetails[typeId]) {
    form.value.typeDetails[typeId] = { details: [], autre: '' }
  }

  const details = form.value.typeDetails[typeId].details
  const index = details.indexOf(detailId)

  if (isSelected && index === -1) {
    details.push(detailId)
  } else if (!isSelected && index > -1) {
    details.splice(index, 1)
  }
}

const loadTicketData = async () => {
  try {
    if (!hasValidTicket.value) {
      return
    }

    const ticketId = ticketInfo.value.b_rec_ticket_id

    // Appel API pour récupérer les données complètes du ticket
    const response = await api.get(`/api/rec/tickets/${ticketId}/complete`)

    if (response.data.success) {
      ticketData.value = response.data.data.ticket
      ticketTypes.value = response.data.data.types || []

      // Initialiser les types sélectionnés et leurs structures de données
       ticketTypes.value.forEach(type => {
         if (!form.value.selectedTypes.hasOwnProperty(type.id)) {
           form.value.selectedTypes[type.id] = false
         }
         if (!form.value.typeDetails[type.id]) {
           form.value.typeDetails[type.id] = {
             details: [],
             autre: ''
           }
         }
       })
    } else {
      throw new Error(response.data.message || 'Erreur lors du chargement des données')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données du ticket:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement',
      caption: error.message
    })
  }
}

const validateForm = () => {
  errors.value = {}

  // Validation de la description
  if (!form.value.description || form.value.description.trim() === '') {
    errors.value.description = 'La description détaillée est requise'
  }

  // Validation : au moins un type doit être sélectionné
  const hasSelectedType = Object.values(form.value.selectedTypes).some(selected => selected)
  if (!hasSelectedType) {
    errors.value.types = 'Veuillez sélectionner au moins un type de réclamation'
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez corriger les erreurs du formulaire'
    })
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()

    // Préparer le payload standardisé selon le format demandé
    const typeSelection = []

    // Parcourir les types sélectionnés
    Object.keys(form.value.selectedTypes).forEach(typeId => {
      if (form.value.selectedTypes[typeId]) {
        const type = ticketTypes.value.find(t => t.id == typeId)
        const typeDetails = form.value.typeDetails[typeId] || { details: [], autre: '' }

        const typeData = {
          b_rec_type_id: parseInt(typeId),
          libelle: type ? type.name : '',
          details: []
        }

        // Ajouter les détails sélectionnés
        if (typeDetails.details && typeDetails.details.length > 0) {
          typeDetails.details.forEach(detailId => {
            const detail = type?.details?.find(d => d.id == detailId)
            if (detail) {
              typeData.details.push({
                b_rec_detail_id: parseInt(detailId),
                libelle: detail.label
              })
            }
          })
        }

        // Ajouter le champ "autre" si rempli
        if (typeDetails.autre && typeDetails.autre.trim() !== '') {
          typeData.details.push({
            b_rec_detail_id: null,
            libelle: typeDetails.autre.trim()
          })
        }

        typeSelection.push(typeData)
      }
    })

    // Construire le payload standardisé
    const payload = {
      tticket_id: ticketInfo.value.t_rec_ticket_id,
      b_rec_ticket_id: ticketInfo.value.b_rec_ticket_id,
      description: form.value.description,
      type_selection: typeSelection
    }

    // Ajouter les données JSON au FormData
    Object.keys(payload).forEach(key => {
      if (key === 'type_selection') {
        formData.append(key, JSON.stringify(payload[key]))
      } else {
        formData.append(key, payload[key])
      }
    })

    // Ajouter les fichiers
    form.value.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })

    const response = await api.post('/api/rec/tickets/save-complete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Réclamation finalisée avec succès',
        caption: 'Votre réclamation a été enregistrée'
      })

      // Nettoyer le store et rediriger
      ticketStore.clearTicket()

    } else {
      throw new Error(response.data.message || 'Erreur lors de la finalisation')
    }
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la finalisation',
      caption: error.message
    })
  } finally {
    isSubmitting.value = false
  }
}

// File handling methods
const onNewFilesSelected = (files) => {
  // Les fichiers sont automatiquement mis à jour dans newFiles
}

const addFiles = () => {
  if (newFiles.value && newFiles.value.length > 0) {
    form.value.files.push(...newFiles.value)
    newFiles.value = null
  }
}

const removeFile = (index) => {
  form.value.files.splice(index, 1)
}

const onRejected = (rejectedEntries) => {
  rejectedEntries.forEach(entry => {
    $q.notify({
      type: 'negative',
      message: `Fichier rejeté: ${entry.file.name}`,
      caption: entry.failedPropValidation
    })
  })
}

const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return 'image'
  if (fileType === 'application/pdf') return 'picture_as_pdf'
  if (fileType.includes('word') || fileType.includes('document')) return 'description'
  return 'attach_file'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

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
    } else {
      console.log('Ticket trouvé:', ticketInfo.value)
      await loadCompleteTicketData()
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

// Lifecycle
onMounted(() => {
  initializePage()
})

// Toutes les variables, computed et fonctions sont automatiquement accessibles dans le template avec <script setup>
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
