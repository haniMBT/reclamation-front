<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section avec navigation -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="feedback" size="2rem" class="text-blue-600 mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-1">Détails de la Réclamation</h1>
              <p class="text-gray-600 text-sm">Consultez les informations détaillées de votre réclamation</p>
            </div>
          </div>

          <!-- Bouton de retour -->
          <q-btn
            label="Retour"
            color="grey-6"
            outline
            icon="arrow_back"
            @click="goBack"
            class="px-4"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <q-spinner-facebook size="3rem" color="blue-6" />
        <span class="ml-3 text-gray-600">Chargement en cours...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <q-icon name="error" size="3rem" class="text-red-500 mb-4" />
        <h3 class="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <q-btn
          label="Réessayer"
          color="red-6"
          outline
          @click="loadReclamation"
          class="px-6"
        />
      </div>

      <!-- Content -->
      <div v-else-if="reclamation" class="space-y-6">
        <!-- Informations principales -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">Informations Générales</h2>
            <q-chip
              :color="getStatusColor(reclamation.statut)"
              text-color="white"
              :label="reclamation.statut_formatte"
              class="font-medium"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Objet -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Objet de la réclamation</label>
              <div class="p-3 bg-gray-50 rounded-md border">
                <p class="text-gray-800 font-medium">{{ reclamation.objet }}</p>
              </div>
            </div>

            <!-- Statut -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Statut actuel</label>
              <div class="p-3 bg-gray-50 rounded-md border">
                <div class="flex items-center">
                  <q-icon
                    :name="getStatusIcon(reclamation.statut)"
                    :color="getStatusColor(reclamation.statut)"
                    size="1.2rem"
                    class="mr-2"
                  />
                  <span class="text-gray-800 font-medium">{{ reclamation.statut_formatte }}</span>
                </div>
              </div>
            </div>

            <!-- Date de création -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Date de création</label>
              <div class="p-3 bg-gray-50 rounded-md border">
                <div class="flex items-center">
                  <q-icon name="schedule" color="blue-600" size="1.2rem" class="mr-2" />
                  <span class="text-gray-800">{{ formatDate(reclamation.date_creation) }}</span>
                </div>
              </div>
            </div>

            <!-- ID de la réclamation -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Numéro de réclamation</label>
              <div class="p-3 bg-gray-50 rounded-md border">
                <div class="flex items-center">
                  <q-icon name="tag" color="green-600" size="1.2rem" class="mr-2" />
                  <span class="text-gray-800 font-mono">#{{ reclamation.id }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu de la réclamation -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <q-icon name="description" color="blue-600" size="1.5rem" class="mr-2" />
            Contenu de la réclamation
          </h3>

          <div class="prose max-w-none">
            <div
              class="p-4 bg-gray-50 rounded-md border prose-sm"
              v-html="reclamation.contenu"
            ></div>
          </div>
        </div>

        <!-- Fichiers joints -->
        <div v-if="reclamation.fichiers && reclamation.fichiers.length > 0" class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <q-icon name="attach_file" color="blue-600" size="1.5rem" class="mr-2" />
            Fichiers joints ({{ reclamation.fichiers.length }})
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="fichier in reclamation.fichiers"
              :key="fichier.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <q-icon
                    :name="getFileIcon(fichier.type_mime)"
                    size="2rem"
                    class="text-blue-600"
                  />
                </div>

                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate" :title="fichier.nom_original">
                    {{ fichier.nom_original }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatFileSize(fichier.taille) }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Ajouté le {{ formatDate(fichier.date_upload) }}
                  </p>
                </div>

                <div class="flex-shrink-0">
                  <q-btn
                    icon="download"
                    size="sm"
                    flat
                    round
                    color="blue-6"
                    @click="downloadFile(fichier)"
                    class="ml-2"
                  >
                    <q-tooltip>Télécharger le fichier</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations de traitement (si traité) -->
        <div v-if="reclamation.statut === 'traitee' || reclamation.statut === 'fermee'" class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <q-icon name="check_circle" color="green-600" size="1.5rem" class="mr-2" />
            Informations de traitement
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Traité par</label>
              <div class="p-3 bg-gray-50 rounded-md border">
                <div class="flex items-center">
                  <q-icon name="person" color="green-600" size="1.2rem" class="mr-2" />
                  <span class="text-gray-800">{{ reclamation.traite_par_name || 'Non spécifié' }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Date de traitement</label>
              <div class="p-3 bg-gray-50 rounded-md border">
                <div class="flex items-center">
                  <q-icon name="event" color="green-600" size="1.2rem" class="mr-2" />
                  <span class="text-gray-800">{{ formatDate(reclamation.date_traitement) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Réponse -->
          <div v-if="reclamation.reponse" class="mt-6 space-y-2">
            <label class="text-sm font-medium text-gray-700">Réponse du support</label>
            <div class="p-4 bg-green-50 border border-green-200 rounded-md">
              <div
                class="prose prose-sm max-w-none text-green-800"
                v-html="reclamation.reponse"
              ></div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Actions</h3>

          <div class="flex flex-wrap gap-3">
            <q-btn
              label="Modifier la réclamation"
              color="blue-6"
              outline
              icon="edit"
              @click="editReclamation"
              :disable="!canEdit"
              class="px-6"
            />

            <!-- <q-btn
              label="Fermer la réclamation"
              color="red-6"
              outline
              icon="close"
              @click="closeReclamation"
              :disable="!canClose"
              class="px-6"
            /> -->

            <q-btn
              label="Nouvelle réclamation"
              color="green-6"
              outline
              icon="add"
              @click="createNewReclamation"
              class="px-6"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { useReclamationStore } from "stores/reclamation";
const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const RecalmationStore = useReclamationStore();


// État réactif
const reclamation = ref(null)
const loading = ref(true)
const error = ref(null)

// Computed properties
const canEdit = computed(() => {
  return reclamation.value && reclamation.value.statut === 'nouvelle'
})

const canClose = computed(() => {
  return reclamation.value &&
         (reclamation.value.statut === 'nouvelle' || reclamation.value.statut === 'en_cours')
})

// Méthodes utilitaires
const getStatusColor = (statut) => {
  const colors = {
    'nouvelle': 'blue',
    'en_cours': 'orange',
    'traitee': 'green',
    'fermee': 'grey'
  }
  return colors[statut] || 'grey'
}

const getStatusIcon = (statut) => {
  const icons = {
    'nouvelle': 'fiber_new',
    'en_cours': 'pending',
    'traitee': 'check_circle',
    'fermee': 'cancel'
  }
  return icons[statut] || 'help'
}

const getFileIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'picture_as_pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'description'
  return 'insert_drive_file'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return 'Non spécifié'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Navigation
const goBack = () => {
  router.go(-1)
}

const editReclamation = () => {

  RecalmationStore.setProperty('id', reclamation.value.id)
  RecalmationStore.setProperty('objet', reclamation.value.objet)
  RecalmationStore.setProperty('contenu', reclamation.value.contenu)

  router.push(`/reclamations/edit`)
}

const closeReclamation = () => {
  // TODO: Implémenter la fermeture
  $q.notify({
    type: 'info',
    message: 'Fonctionnalité de fermeture à implémenter',
    position: 'top'
  })
}

const createNewReclamation = () => {
  router.push('/reclamation_client')
}

// Téléchargement de fichiers
const downloadFile = async (fichier) => {
  try {
    const response = await api.get(`/api/reclamation/${reclamation.value.id}/fichier/${fichier.id}/download`, {
      responseType: 'blob'
    })

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fichier.nom_original)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    $q.notify({
      type: 'positive',
      message: 'Téléchargement démarré',
      position: 'top'
    })
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du téléchargement',
      position: 'top'
    })
  }
}

// Chargement des données
const loadReclamation = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get(`/api/reclamation/${route.params.id}`)

    if (response.data.success) {
      reclamation.value = response.data.data
    } else {
      throw new Error(response.data.message || 'Erreur lors du chargement')
    }
  } catch (err) {
    console.error('Erreur:', err)
    error.value = err.response?.data?.message || err.message || 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (route.params.id) {
    loadReclamation()
  } else {
    error.value = 'ID de réclamation manquant'
    loading.value = false
  }
})
</script>

<style scoped>
/* Styles personnalisés */
.prose {
  line-height: 1.6;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul, .prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

/* Animation pour les cartes */
.bg-white {
  transition: transform 0.2s ease-in-out;
}

.bg-white:hover {
  transform: translateY(-2px);
}

/* Styles pour les fichiers */
.file-card {
  transition: all 0.3s ease;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

