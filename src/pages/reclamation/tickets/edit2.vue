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
              Type(s) de réclamation
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
          <div v-if="form.info_generales.length > 0" class="mb-6">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center mb-4">
                <q-icon name="info" class="text-yellow-600 mr-3" size="1.5rem" />
                <h3 class="text-lg font-medium text-yellow-800">Informations générales</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="info in form.info_generales" :key="info.info_general_id" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ info.libelle }}
                    <span v-if="info.key_attribut" class="text-red-500">*</span>
                  </label>
                  <q-input
                    v-if="info.type == 'date'"
                    v-model="info.value"
                    type="date"
                    outlined
                    dense
                    :placeholder="`Sélectionnez la date pour ${info.libelle.toLowerCase()}`"
                    :required="info.key_attribut"
                    class="w-full"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="text-yellow-600" />
                    </template>
                  </q-input>

                  <q-input
                    v-else-if="info.type == 'numéro'"
                    v-model="info.value"
                    outlined
                    dense
                    type="number"
                    :placeholder="`Entrez le numéro pour ${info.libelle.toLowerCase()}`"
                    :required="info.key_attribut"
                    class="w-full"
                    inputmode="numeric"
                    pattern="[0-9 ]*"
                  >
                    <template v-slot:prepend>
                      <q-icon name="pin" class="text-yellow-600" />
                    </template>
                  </q-input>

                  <q-input
                    v-else-if="info.type == 'montant'"
                    v-model="info.value"
                    outlined
                    dense
                    :placeholder="`Entrez le montant pour ${info.libelle.toLowerCase()}`"
                    :required="info.key_attribut"
                    class="w-full"
                    @keypress="filterAmountKeypress"
                    @input="sanitizeAmountInputEdit(info.key_attribut, $event)"
                    inputmode="text"
                    pattern="[0-9\s.,]*"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" class="text-yellow -600" />
                    </template>
                  </q-input>

                  <q-input
                    v-else
                    v-model="info.value"
                    outlined
                    dense
                    :placeholder="`Entrez ${info.libelle.toLowerCase()}`"
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
          <div v-if="ticketData.base_ticket.documentAFournir" class="mb-6">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-start">
                <q-icon name="description" class="text-yellow-900 mr-3 mt-0.5" />
                <div class="text-sm text-yellow-900">
                  <p class="font-medium mb-2">Documents à fournir :</p>
                  <div class="text-yellow-900" v-html="ticketData.base_ticket.documentAFournir"></div>
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
                  <q-icon name="attach_file" class="text-yellow-600" />
                </template>
                <template v-slot:hint>
                  Formats acceptés: Images, PDF, Word. Taille max: 10Mo par fichier
                </template>
              </q-file>

              <q-btn
                label="Ajouter"
                color="yellow-9"
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
                      class="text-yellow-600 mr-3"
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
  // Synchroniser UNIQUEMENT de info_generales vers infosGenerales (compatibilité)
  if (form.value.info_generales && form.value.info_generales.length > 0) {
    form.value.info_generales.forEach(info => {
      form.value.infosGenerales[info.key_attribut] = info.value
    })
  }
}

// Watcher pour synchroniser automatiquement (array -> dict)
watch(() => form.value.info_generales, () => {
  syncInfoGenerales()
}, { deep: true })

// Computed
const isFormValid = computed(() => {
  // Vérifier que la description est remplie
  if (!form.value.description || form.value.description.trim() === '') {
    return false
  }

  // Les types ne sont pas obligatoires en modification
  // const hasSelectedType = Object.values(form.value.selectedTypes).some(selected => selected)
  // if (!hasSelectedType) {
  //   return false
  // }

  // Vérifier les informations générales obligatoires via form.info_generales
  for (const info of form.value.info_generales) {
    const val = (info.value ?? '').toString()
    if (info.key_attribut && (val.trim() === '')) {
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
      if (data.infos_generales && data.base_ticket.infos_generales) {
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

  if (data.infos_generales && data.infos_generales.length > 0) {
    // Construire une map des définitions du ticket de base pour enrichir (key_attribut, type, libelle)
    const baseMap = (data.base_ticket?.infos_generales || []).reduce((acc, base) => {
      const id = base.id ?? base.info_general_id
      if (id) acc[id] = base
      return acc
    }, {})

    // Utiliser directement les objets info_generales du ticket, enrichis avec la base si nécessaire
    form.value.info_generales = data.infos_generales.map(info => {
      const id = info.info_general_id ?? info.id
      const base = id ? baseMap[id] || {} : {}
      const key = info.key_attribut ?? base.key_attribut ?? ''
      const type = info.type ?? base.type ?? null
      const libelle = info.libelle ?? base.libelle ?? ''
      const rawVal = (info.value ?? info.valeur ?? '')
      return {
        info_general_id: id,
        libelle,
        value: rawVal,
        key_attribut: key,
        type
      }
    })

    // Maintenir la compatibilité avec l'ancien format dictionnaire et formater les montants pour l'affichage
    form.value.info_generales.forEach(info => {
      if (info.key_attribut) {
        const displayVal = info.type === 'montant' ? formatAmountDisplay(info.value ?? '') : (info.value ?? '')
        form.value.infosGenerales[info.key_attribut] = displayVal
      }
    })
    // Normaliser l'affichage selon le type et synchroniser vers le dictionnaire
    form.value.info_generales.forEach(info => {
      if (info.key_attribut) {
        let displayVal = info.value ?? ''
        if (info.type === 'date') {
          displayVal = normalizeDateDisplay(displayVal)
        } else if (info.type === 'montant') {
          displayVal = formatAmountDisplay(displayVal)
        } else if (info.type === 'numéro') {
          displayVal = displayVal.toString().replace(/[^\d]/g, '')
        }
        // Mettre à jour la source principale
        info.value = displayVal
        // Compatibilité dict
        form.value.infosGenerales[info.key_attribut] = displayVal
      }
    })
  } else if (data.base_ticket?.infos_generales && data.base_ticket.infos_generales.length > 0) {
    // Fallback: initialiser depuis les définitions du ticket de base si aucune donnée spécifique n'est fournie
    data.base_ticket.infos_generales.forEach(base => {
      form.value.info_generales.push({
        info_general_id: base.id ?? base.info_general_id,
        libelle: base.libelle,
        value: '',
        key_attribut: base.key_attribut ?? '',
        type: base.type ?? null
      })
      if (base.key_attribut) {
        form.value.infosGenerales[base.key_attribut] = ''
      }
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

  // Les types ne sont pas obligatoires en modification, pas d'erreur si vide
  //  const hasSelectedType = Object.values(form.value.selectedTypes).some(selected => selected)
  // if (!hasSelectedType) {
  //   errors.value.types = 'Veuillez sélectionner au moins un type de réclamation'
  // }

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
          valeur: info.value,
          type: info.type || null
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

// Utilitaires pour la saisie des montants
const filterAmountKeypress = (evt) => {
  const key = evt.key ?? ''
  const allowed = /[0-9\s.,]/
  if (!allowed.test(key)) {
    evt.preventDefault()
  }
}

// Formater un montant pour l'affichage initial (groupement des milliers avec '.' et décimales ',')
const formatAmountDisplay = (val) => {
  let raw = (val ?? '').toString()
  raw = raw.replace(/[^\d.,\s]/g, '')
  raw = raw.replace(/\s+/g, '')

  const lastComma = raw.lastIndexOf(',')
  const lastDot = raw.lastIndexOf('.')
  const lastSepIdx = Math.max(lastComma, lastDot)

  let intPart = raw
  let decPart = ''
  if (lastSepIdx !== -1) {
    intPart = raw.slice(0, lastSepIdx)
    decPart = raw.slice(lastSepIdx + 1).replace(/[^\d]/g, '')
  }

  intPart = intPart.replace(/[^\d]/g, '')
  intPart = intPart.replace(/^0+(?=\d)/, '')
  if (intPart.length === 0) intPart = '0'

  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  let formatted = grouped
  if (decPart.length > 0) {
    if (decPart.length > 2) decPart = decPart.slice(0, 2)
    else if (decPart.length < 2) decPart = decPart.padEnd(2, '0')
    formatted = `${grouped},${decPart}`
  }

  return formatted
}
// Normaliser une date en format YYYY-MM-DD pour l'affichage dans un input de type date
const normalizeDateDisplay = (val) => {
  let s = (val ?? '').toString().trim()
  if (s.length === 0) return ''
  // Remplacer '/' par '-'
  s = s.replace(/\//g, '-')
  // Couper la partie temps si présente
  if (s.includes('T')) s = s.split('T')[0]
  if (s.includes(' ')) s = s.split(' ')[0]
  const parts = s.split('-').filter(Boolean)
  if (parts.length !== 3) return s
  let y, m, d
  // Détection du format: si premier segment a 4 chiffres => YYYY-MM-DD, sinon DD-MM-YYYY
  if (/^\d{4}$/.test(parts[0])) {
    y = parts[0]
    m = parts[1]
    d = parts[2]
  } else if (/^\d{4}$/.test(parts[2])) {
    // DD-MM-YYYY -> convertir
    y = parts[2]
    m = parts[1]
    d = parts[0]
  } else {
    // Format inconnu, retourner tel quel
    return s
  }
  // Pad des composantes
  m = m.padStart(2, '0')
  d = d.padStart(2, '0')
  return `${y}-${m}-${d}`
}
const sanitizeAmountInputEdit = (keyAttr, val) => {
  let raw = (val ?? '').toString()
  // garder chiffres et séparateurs , . et espaces
  raw = raw.replace(/[^\d.,\s]/g, '')
  // retirer espaces
  raw = raw.replace(/\s+/g, '')

  // détecter le dernier séparateur décimal (.,)
  const lastComma = raw.lastIndexOf(',')
  const lastDot = raw.lastIndexOf('.')
  const lastSepIdx = Math.max(lastComma, lastDot)

  let intPart = raw
  let decPart = ''
  if (lastSepIdx !== -1) {
    intPart = raw.slice(0, lastSepIdx)
    decPart = raw.slice(lastSepIdx + 1).replace(/[^\d]/g, '')
  }

  // nettoyer la partie entière et enlever les zéros en tête
  intPart = intPart.replace(/[^\d]/g, '')
  intPart = intPart.replace(/^0+(?=\d)/, '')
  if (intPart.length === 0) intPart = '0'

  // regrouper par milliers avec '.'
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  let formatted = grouped
  if (decPart.length > 0) {
    // tronquer/padder à 2 décimales
    if (decPart.length > 2) decPart = decPart.slice(0, 2)
    else if (decPart.length < 2) decPart = decPart.padEnd(2, '0')
    formatted = `${grouped},${decPart}`
  }

  // affecter la valeur formatée au dictionnaire pour compatibilité
  form.value.infosGenerales[keyAttr] = formatted
  // et mettre à jour la source principale
  const item = form.value.info_generales.find(i => i.key_attribut === keyAttr)
  if (item) item.value = formatted
}
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