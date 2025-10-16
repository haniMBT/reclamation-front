<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Message d'alerte fixe en haut -->
    <div class="fixed top-16 left-20 right-20 bg-red-600 text-white px-4 py-3 z-50 shadow-lg">
      <div class="container mx-auto flex items-center justify-center">
        <q-icon name="warning" class="mr-2" />
        <span class="font-medium">Attention : Vous devez valider votre réclamation pour qu'elle soit traitée</span>
      </div>
    </div>

    <!-- Bouton de validation fixe en haut à droite -->
    <div class="fixed top-16 right-4 z-40">
      <q-btn
        @click="validateTicket"
        color="green-6"
        :loading="isSubmitting"
        :disable="!isFormValid || loading"
        size="lg"
        round
        icon="check"
        class="shadow-lg"
      >
        <q-tooltip>Valider la réclamation</q-tooltip>
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </div>

    <div class="container mx-auto px-4 py-8" style="margin-top: 60px;">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="edit" size="2rem" class="text-orange-600 mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-1">Modifier la réclamation</h1>
              <p class="text-gray-600 text-sm">Modifiez les informations de votre réclamation</p>
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
        <q-spinner-dots size="3rem" color="orange-6" />
        <span class="ml-3 text-gray-600">Chargement des informations...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="!ticketData.id" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="error" class="text-red-500 mr-3" size="1.5rem" />
          <div>
            <h3 class="text-red-800 font-medium">Réclamation non trouvée</h3>
            <p class="text-red-600 text-sm mt-1">La réclamation demandée n'existe pas ou n'est plus accessible.</p>
          </div>
        </div>
        <q-btn
          @click="goToTicketsList"
          color="red-6"
          no-caps
          unelevated
          class="px-6"
          icon="list"
        >
          Retour à la liste
        </q-btn>
      </div>

      <!-- Main Form -->
      <div v-else class="bg-white rounded-lg shadow-sm p-6">
        <q-form @submit="submitForm" class="q-gutter-md">
          <!-- Objet de la réclamation -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Objet de la réclamation *
            </label>
            <q-input
              v-model="form.objet"
              outlined
              dense
              placeholder="Saisissez l'objet de votre réclamation..."
              class="w-full"
              :rules="[val => !!val || 'L\'objet est obligatoire']"
            >
              <template v-slot:prepend>
                <q-icon name="subject" class="text-orange-600" />
              </template>
            </q-input>
            <div v-if="errors.objet" class="text-red-600 text-xs mt-1">
              {{ errors.objet }}
            </div>
          </div>

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
                    color="orange-6"
                    class="mt-1"
                  />
                  <div class="flex-1">
                    <label class="font-medium text-gray-800 cursor-pointer" @click="form.selectedTypes[type.id] = !form.selectedTypes[type.id]">
                      {{ type.libelle }}
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
                            {{ detail.libelle }}
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

          <!-- Informations générales -->
          <div v-if="infosGenerales.length > 0" class="mb-6">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center mb-4">
                <q-icon name="info" class="text-yellow-600 mr-3" size="1.5rem" />
                <h3 class="text-lg font-medium text-yellow-800">Informations générales</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="info in infosGenerales" :key="info.id" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ info.libelle }}
                    <span v-if="info.key_attribut" class="text-red-500">*</span>
                  </label>
                  <q-input
                    v-model="form.infosGenerales[info.key_attribut]"
                    outlined
                    dense
                    :placeholder="`Saisir ${info.libelle.toLowerCase()}`"
                    :required="info.key_attribut"
                    class="w-full"
                  >
                    <template v-slot:prepend>
                      <q-icon name="edit" class="text-yellow-600" />
                    </template>
                  </q-input>
                </div>
              </div>
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

          <!-- Fichiers existants -->
          <div v-if="existingFiles.length > 0" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fichiers existants
            </label>
            <div class="space-y-2">
              <div
                v-for="(file, index) in existingFiles"
                :key="file.id"
                class="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200"
              >
                <div class="flex items-center">
                  <q-icon
                    :name="getFileIcon(file.type_fichier)"
                    size="1.5rem"
                    class="text-green-600 mr-3"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-800">{{ file.nom_fichier }}</div>
                    <div class="text-xs text-gray-500">{{ formatFileSize(file.taille_fichier) }}</div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <q-btn
                    icon="download"
                    size="sm"
                    flat
                    round
                    color="primary"
                    @click="downloadFile(file)"
                  >
                    <q-tooltip>Télécharger</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="sm"
                    flat
                    round
                    color="negative"
                    @click="removeExistingFile(file.id)"
                  >
                    <q-tooltip>Supprimer</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>

          <!-- Nouveaux fichiers joints -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ajouter de nouveaux fichiers (optionnel)
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

            <!-- Liste des nouveaux fichiers sélectionnés -->
            <div v-if="form.files.length > 0" class="mt-3">
              <div class="text-sm font-medium text-gray-700 mb-2">
                Nouveaux fichiers sélectionnés ({{ form.files.length }}) :
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
              label="Mettre à jour la réclamation"
              color="orange-6"
              type="submit"
              :loading="isSubmitting"
              :disable="!isFormValid"
              class="px-8"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
              <q-icon name="save" class="ml-2" />
            </q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

// Composables
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// State
const loading = ref(true)
const isSubmitting = ref(false)
const ticketData = ref({})
const ticketTypes = ref([])
const infosGenerales = ref([])
const ticketInfosGenerales = ref([])
const existingFiles = ref([])
const newFiles = ref(null)
const errors = ref({})
const filesToDelete = ref([])

// Form data
const form = ref({
  objet: '',
  description: '',
  selectedTypes: {}, // Types sélectionnés (id => boolean)
  typeDetails: {}, // Structure: { type_id: { details: [detail_ids], autre: 'texte' } }
  infosGenerales: {}, // Structure: { key_attribut: 'valeur' } - pour compatibilité
  info_generales: [], // Structure complète: [{ info_general_id, libelle, value, key_attribut }]
  files: [] // Nouveaux fichiers
})

// Fonction de synchronisation bidirectionnelle
const syncInfoGenerales = () => {
  // Synchroniser de infosGenerales vers info_generales
  if (form.value.info_generales && form.value.info_generales.length > 0) {
    form.value.info_generales.forEach(info => {
      if (form.value.infosGenerales[info.key_attribut] !== undefined) {
        info.value = form.value.infosGenerales[info.key_attribut]
      }
    })
  }

  // Synchroniser de info_generales vers infosGenerales
  if (form.value.info_generales && form.value.info_generales.length > 0) {
    form.value.info_generales.forEach(info => {
      form.value.infosGenerales[info.key_attribut] = info.value
    })
  }
}

// Watcher pour synchroniser automatiquement
watch(() => form.value.infosGenerales, () => {
  syncInfoGenerales()
}, { deep: true })

// Computed
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

  // Vérifier les informations générales obligatoires
  for (const info of infosGenerales.value) {
    if (info.key_attribut && (!form.value.infosGenerales[info.key_attribut] || form.value.infosGenerales[info.key_attribut].trim() === '')) {
      return false
    }
  }

  return true
})

// Watcher pour initialiser typeDetails quand selectedTypes change
watch(() => form.value.selectedTypes, (newSelectedTypes) => {
  Object.keys(newSelectedTypes).forEach(typeId => {
    if (newSelectedTypes[typeId] && !form.value.typeDetails[typeId]) {
      form.value.typeDetails[typeId] = { details: [], autre: '' }
    }
  })
}, { deep: true })

// Methods
const loadTicketData = async () => {
  const ticketId = route.params.id
  if (!ticketId) {
    $q.notify({
      type: 'negative',
      message: 'ID de réclamation manquant',
      position: 'top'
    })
    return
  }

  try {
    // Récupérer les données complètes du ticket
    const response = await api.get(`/api/rec/tickets/${ticketId}/edit`)

    if (response.data.success) {
      const data = response.data.data

      // Données du ticket principal
      ticketData.value = data

      // Types disponibles - récupérer depuis baseTicket.types pour les types disponibles
      // et utiliser data.types pour les types sélectionnés
      if (data.base_ticket && data.base_ticket.types) {
        ticketTypes.value = data.base_ticket.types
      }

      // Informations générales disponibles - récupérer depuis baseTicket
      if (data.base_ticket && data.base_ticket.infos_generales) {
      console.log('Infos générales du ticket de base:', data.base_ticket.infos_generales);

        infosGenerales.value = data.base_ticket.infos_generales
      }

      // Informations générales du ticket créé - pour pré-remplir les valeurs
      if (data.infos_generales) {
        ticketInfosGenerales.value = data.infos_generales
      }

      // Fichiers existants
      existingFiles.value = data.files || []

      // Pré-remplir le formulaire
      initializeFormFromTicketData(data)

    } else {
      throw new Error(response.data.message || 'Erreur lors du chargement')
    }
  } catch (error) {
    console.error('Erreur lors du chargement du ticket:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement de la réclamation',
      position: 'top'
    })
  }
}

const initializeFormFromTicketData = (data) => {
  // Objet de la réclamation
  form.value.objet = data.objet || ''
  
  // Description - les données sont directement dans data, pas dans data.ticket
  form.value.description = data.description || ''

  // Types sélectionnés
  if (data.types) {
    data.types.forEach(type => {
      form.value.selectedTypes[type.b_rec_type_id] = true

      // Initialiser les détails du type
      form.value.typeDetails[type.b_rec_type_id] = {
        details: type.details ? type.details.map(d => d.b_rec_detail_id) : [],
        autre: type.autre || ''
      }
    })
  }

  // Pré-remplir les informations générales

  // Initialiser les types non sélectionnés
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

  // Informations générales - créer des objets complets avec tous les champs
  form.value.info_generales = []

  if (ticketInfosGenerales.value && ticketInfosGenerales.value.length > 0) {
    // Pré-remplir avec les valeurs existantes du ticket
    ticketInfosGenerales.value.forEach(ticketInfo => {
      // Trouver l'info générale correspondante dans la définition du ticket de base
      const baseInfo = infosGenerales.value.find(info => info.id === ticketInfo.info_general_id)
      if (baseInfo) {
        form.value.info_generales.push({
          info_general_id: ticketInfo.info_general_id,
          libelle: baseInfo.libelle,
          value: ticketInfo.value || '',
          key_attribut: baseInfo.key_attribut
        })
        // Maintenir la compatibilité avec l'ancien format
        form.value.infosGenerales[baseInfo.key_attribut] = ticketInfo.value || ''
      }
    })
  } else {
    // Initialiser avec des valeurs vides si pas de données existantes
    infosGenerales.value.forEach(info => {
      form.value.info_generales.push({
        info_general_id: info.id,
        libelle: info.libelle,
        value: '',
        key_attribut: info.key_attribut
      })
      // Maintenir la compatibilité avec l'ancien format
      form.value.infosGenerales[info.key_attribut] = ''
    })
  }

  // Synchroniser les structures après l'initialisation
  syncInfoGenerales()
}

const toggleDetail = (typeId, detailId, isSelected) => {
  if (!form.value.typeDetails[typeId]) {
    form.value.typeDetails[typeId] = { details: [], autre: '' }
  }

  const details = form.value.typeDetails[typeId].details
  const index = details.indexOf(detailId)

  if (isSelected && index === -1) {
    details.push(detailId)
  } else if (!isSelected && index !== -1) {
    details.splice(index, 1)
  }
}

const validateForm = () => {
  errors.value = {}

  if (!form.value.objet || form.value.objet.trim() === '') {
    errors.value.objet = 'L\'objet est obligatoire'
  }

  if (!form.value.description || form.value.description.trim() === '') {
    errors.value.description = 'La description est obligatoire'
  }

  const hasSelectedType = Object.values(form.value.selectedTypes).some(selected => selected)
  if (!hasSelectedType) {
    errors.value.types = 'Veuillez sélectionner au moins un type de réclamation'
  }

  return Object.keys(errors.value).length === 0
}

const validateTicket = async () => {
  if (!validateForm()) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez corriger les erreurs du formulaire',
      position: 'top'
    })
    return
  }

  // Afficher le modal de confirmation
  $q.dialog({
    title: 'Confirmation de validation',
    message: 'Êtes-vous sûr de vouloir valider cette réclamation ? Cette action est définitive et changera le statut à "En attente".',
    cancel: true,
    persistent: true,
    color: 'positive'
  }).onOk(async () => {
    isSubmitting.value = true

    try {
      // Appeler l'API de validation
      const response = await api.post('/api/rec/tickets/validate', {
        ticket_id: route.params.id
      })

    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Réclamation validée avec succès',
        position: 'top'
      })

      // Rediriger vers la liste des tickets (allTicket)
      router.push('/reclamations/allTicket')
    } else {
      throw new Error(response.data.message || 'Erreur lors de la validation')
    }

    } catch (error) {
      console.error('Erreur lors de la validation:', error)

      let errorMessage = 'Erreur lors de la validation de la réclamation'

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        errorMessage = Object.values(errors).flat().join(', ')
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      $q.notify({
        type: 'negative',
        message: errorMessage,
        position: 'top'
      })
    } finally {
      isSubmitting.value = false
    }
  })
}

const submitForm = async () => {
  if (!validateForm()) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez corriger les erreurs du formulaire',
      position: 'top'
    })
    return
  }

  isSubmitting.value = true

  try {
    // Créer FormData pour inclure les fichiers
    const formData = new FormData()

    // Ajouter l'objet
    formData.append('objet', form.value.objet)
    
    // Ajouter la description
    formData.append('description', form.value.description)

    // Préparer les types sélectionnés avec leurs détails
    const typeSelection = Object.keys(form.value.selectedTypes)
      .filter(typeId => form.value.selectedTypes[typeId])
      .map(typeId => ({
        b_rec_type_id: parseInt(typeId),
        libelle: ticketTypes.value.find(t => t.id == typeId)?.libelle || '',
        details: form.value.typeDetails[typeId]?.details?.map(detailId => ({
          b_rec_detail_id: detailId,
          libelle: ticketTypes.value
            .find(t => t.id == typeId)?.details
            ?.find(d => d.id == detailId)?.libelle || ''
        })) || [],
        autre: form.value.typeDetails[typeId]?.autre || ''
      }))

    // Ajouter la sélection des types
    formData.append('type_selection', JSON.stringify(typeSelection))

    // Ajouter les fichiers sélectionnés avant l'envoi même si les fichiers n'ont pas été ajoutés
    addFiles()

    // Synchroniser avant l'envoi
    syncInfoGenerales()

    // Ajouter les informations générales si présentes
    if (form.value.info_generales && form.value.info_generales.length > 0) {
      const infosGeneralesData = form.value.info_generales
        .filter(info => info.value && info.value.trim() !== '')
        .map(info => ({
          id: info.info_general_id,
          libelle: info.libelle,
          valeur: info.value
        }))

      console.log('form.value.info_generales:', form.value.info_generales);
      console.log('infosGeneralesData to send:', infosGeneralesData);


      if (infosGeneralesData.length > 0) {
        formData.append('infos_generales', JSON.stringify(infosGeneralesData))
      }
    }

    // Ajouter les nouveaux fichiers
    form.value.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })

    // Ajouter les fichiers à supprimer
    if (filesToDelete.value.length > 0) {
      formData.append('files_to_delete', JSON.stringify(filesToDelete.value))
    }



    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    // Ajouter _method pour Laravel
    formData.append('_method', 'PUT')

    // Envoyer la requête de mise à jour
    const response = await api.post(`/api/rec/tickets/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Réclamation mise à jour avec succès',
        position: 'top'
      })

      // Rediriger vers la liste des tickets
      // router.push('/reclamations/allTicket')
    } else {
      throw new Error(response.data.message || 'Erreur lors de la mise à jour')
    }

  } catch (error) {
    console.error('Erreur lors de la soumission:', error)

    let errorMessage = 'Erreur lors de la mise à jour de la réclamation'

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      errorMessage = Object.values(errors).flat().join(', ')
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top'
    })
  } finally {
    isSubmitting.value = false
  }
}

const onNewFilesSelected = (files) => {
  // Cette fonction est appelée quand de nouveaux fichiers sont sélectionnés
  console.log('Nouveaux fichiers sélectionnés:', files)
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

const removeExistingFile = (fileId) => {
  $q.dialog({
    title: 'Confirmer la suppression',
    message: 'Êtes-vous sûr de vouloir supprimer ce fichier ?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Ajouter à la liste des fichiers à supprimer
    filesToDelete.value.push(fileId)

    // Retirer de la liste des fichiers existants
    const index = existingFiles.value.findIndex(f => f.id === fileId)
    if (index !== -1) {
      existingFiles.value.splice(index, 1)
    }

    $q.notify({
      type: 'info',
      message: 'Fichier marqué pour suppression',
      position: 'top'
    })
  })
}

const downloadFile = async (file) => {
  try {
    const response = await api.get(`/api/rec/tickets/files/${file.id}/download`, {
      responseType: 'blob'
    })

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.nom_fichier)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du téléchargement du fichier',
      position: 'top'
    })
  }
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

const goBack = () => {
  router.go(-1)
}

const goToTicketsList = () => {
  router.push('/reclamations/tickets')
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  await loadTicketData()
  loading.value = false
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

/* Styles pour les éléments fixes */
.fixed {
  position: fixed !important;
}

/* Animation pour le bouton de validation */
.fixed .q-btn {
  transition: all 0.3s ease;
}

.fixed .q-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Style pour le message d'alerte */
.bg-red-600 {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

/* Assurer que le contenu ne soit pas masqué par les éléments fixes */
body {
  padding-top: 60px;
}
</style>