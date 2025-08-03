<template>
  <div class="tw-bg-gray-50">
    <div class="tw-container tw-mx-auto tw-px-4 tw-py-8">
      <!-- Header Section -->
      <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6 tw-mb-6">
        <div class="tw-flex tw-items-center tw-mb-4">
          <q-icon name="feedback" size="2rem" class="tw-text-blue-600 tw-mr-3" />
          <div>
            <h1 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-1">Réclamation Client</h1>
            <p class="tw-text-gray-600 tw-text-sm">Envoyez votre réclamation en remplissant le formulaire ci-dessous</p>
          </div>
        </div>
      </div>

      <!-- Main Form -->
      <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6">
        <q-form @submit="submitComplaint" class="q-gutter-md">
          <!-- Objet de la réclamation -->
          <div class="tw-mb-6">
            <q-input
              v-model="complaint.subject"
              label="Objet de la réclamation"
              outlined
              dense
              class="tw-w-full"
              :rules="[val => !!val || 'L\'objet est requis']"
            >
              <template v-slot:prepend>
                <q-icon name="subject" class="tw-text-blue-600" />
              </template>
            </q-input>
          </div>

          <!-- Contenu de la réclamation -->
          <div class="tw-mb-6">
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
              Contenu de la réclamation *
            </label>
            <q-editor
              v-model="complaint.content"
              min-height="250px"
              placeholder="Décrivez votre réclamation ici..."
              :toolbar="[
                ['bold', 'italic', 'underline', 'strike'],
                ['quote', 'unordered', 'ordered'],
                ['undo', 'redo'],
                ['fullscreen']
              ]"
              class="tw-border tw-rounded-md"
            />
            <div v-if="contentError" class="tw-text-red-600 tw-text-xs tw-mt-1">
              Le contenu de la réclamation est requis
            </div>
          </div>

          <!-- Fichiers joints -->
          <div class="tw-mb-6">
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
              Fichiers joints (optionnel)
            </label>

            <!-- Zone d'ajout de fichiers -->
            <div class="tw-flex tw-gap-3 tw-mb-3">
              <q-file
                v-model="newFiles"
                multiple
                outlined
                dense
                accept="image/*,application/pdf,.doc,.docx,.txt"
                max-file-size="10485760"
                class="tw-flex-1"
                @rejected="onRejected"
                @update:model-value="onNewFilesSelected"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" class="tw-text-blue-600" />
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
                class="tw-px-4"
              >
                <q-icon name="add" class="tw-mr-1" />
              </q-btn>
            </div>

            <!-- Liste des fichiers sélectionnés -->
            <div v-if="allFiles.length > 0" class="tw-mt-3">
              <div class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                Fichiers sélectionnés ({{ allFiles.length }}) :
              </div>
              <div class="tw-space-y-2">
                <div
                  v-for="(file, index) in allFiles"
                  :key="index"
                  class="tw-flex tw-items-center tw-justify-between tw-bg-gray-50 tw-p-3 tw-rounded-md tw-border"
                >
                  <div class="tw-flex tw-items-center">
                    <q-icon
                      :name="getFileIcon(file.type)"
                      size="1.5rem"
                      class="tw-text-blue-600 tw-mr-3"
                    />
                    <div>
                      <div class="tw-text-sm tw-font-medium tw-text-gray-800">{{ file.name }}</div>
                      <div class="tw-text-xs tw-text-gray-500">{{ formatFileSize(file.size) }}</div>
                    </div>
                  </div>
                  <q-btn
                    icon="close"
                    size="sm"
                    flat
                    round
                    color="negative"
                    @click="removeFile(index)"
                    class="tw-ml-2"
                  >
                    <q-tooltip>Supprimer le fichier</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="tw-flex tw-justify-between tw-items-center tw-pt-6 tw-border-t tw-border-gray-200">
            <q-btn
              label="Annuler"
              color="grey-6"
              flat
              @click="resetForm"
              class="tw-px-6"
            />
            <q-btn
              label="Envoyer la réclamation"
              color="blue-6"
              type="submit"
              :loading="isSubmitting"
              :disable="!isFormValid"
              class="tw-px-8"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
              <q-icon name="send" class="tw-ml-2" />
            </q-btn>
          </div>
        </q-form>
      </div>

      <!-- Information complémentaire -->
      <div class="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-lg tw-p-4 tw-mt-6">
        <div class="tw-flex tw-items-start">
          <q-icon name="info" class="tw-text-blue-600 tw-mr-3 tw-mt-0.5" />
          <div class="tw-text-sm tw-text-blue-800">
            <p class="tw-font-medium tw-mb-1">Informations importantes :</p>
            <ul class="tw-list-disc tw-list-inside tw-space-y-1 tw-text-blue-700">
              <li>Votre réclamation sera traitée dans les plus brefs délais</li>
              <!-- <li>Vous recevrez une confirmation par email</li>
              <li>Un suivi vous sera communiqué sous 48h ouvrables</li> -->
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const $q = useQuasar()
const router = useRouter()

// État du formulaire
const complaint = ref({
  subject: '',
  content: '',
  attachments: null
})

// Nouveaux états pour la gestion progressive des fichiers
const newFiles = ref(null)
const allFiles = ref([])

const isSubmitting = ref(false)
const contentError = ref(false)

// Computed properties
const isFormValid = computed(() => {
  return complaint.value.subject.trim() !== '' &&
         complaint.value.content.trim() !== '' &&
         complaint.value.content !== '<p><br></p>' // Vérifie que le contenu n'est pas vide
})

// Fonctions utilitaires
const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return 'image'
  if (fileType === 'application/pdf') return 'picture_as_pdf'
  if (fileType.includes('word') || fileType.includes('document')) return 'description'
  return 'insert_drive_file'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Gestion progressive des fichiers
const onNewFilesSelected = (files) => {
  // Cette méthode est appelée quand des fichiers sont sélectionnés
  console.log('Nouveaux fichiers sélectionnés:', files)
}

const addFiles = () => {
  if (newFiles.value && Array.isArray(newFiles.value)) {
    const addedCount = newFiles.value.length

    // Ajouter les nouveaux fichiers à la liste globale
    allFiles.value = [...allFiles.value, ...newFiles.value]

    // Réinitialiser le champ de sélection
    newFiles.value = null

    $q.notify({
      type: 'positive',
      message: `${addedCount} fichier(s) ajouté(s)`,
      position: 'top',
      timeout: 2000
    })
  }
}

const removeFile = (index) => {
  allFiles.value.splice(index, 1)

  $q.notify({
    type: 'info',
    message: 'Fichier supprimé',
    position: 'top',
    timeout: 2000
  })
}

const onRejected = (rejectedEntries) => {
  $q.notify({
    type: 'negative',
    message: `Fichier(s) rejeté(s): ${rejectedEntries.length}`,
    caption: 'Vérifiez le format et la taille des fichiers'
  })
}

const resetForm = () => {
  complaint.value = {
    subject: ' ',
    content: '',
    attachments: null
  }
  newFiles.value = null
  allFiles.value = []
  contentError.value = false
}

const submitComplaint = async () => {
  // Validation du contenu
  if (!complaint.value.content.trim() || complaint.value.content === '<p><br></p>') {
    contentError.value = true
    $q.notify({
      type: 'negative',
      message: 'Veuillez renseigner le contenu de votre réclamation',
      position: 'top'
    })
    return
  }

  // ajouter les fichiers sélectionnés avant l'envoi meme si les fichiers n'ont pas été ajoutés
  addFiles();

  contentError.value = false
  isSubmitting.value = true

  try {
    // Créer FormData pour l'envoi
    const formData = new FormData()

    // Ajouter les données de base
    formData.append('objet', complaint.value.subject)
    formData.append('contenu', complaint.value.content)

    // Ajouter les fichiers s'il y en a
    if (allFiles.value.length > 0) {
      allFiles.value.forEach((file, index) => {
        formData.append(`fichiers[${index}]`, file)
      })
    }

    // Envoyer vers l'API Laravel
    const response = await api.post('/api/reclamation', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Vérifier la réponse
    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Réclamation envoyée avec succès',
        // caption: `ID de réclamation: ${response.data.data.reclamation_id}`,
        position: 'top',
        timeout: 5000
      })

      resetForm()

      // Optionnel: rediriger vers une page de confirmation
      // router.push('/dashboard')
    } else {
      throw new Error(response.data.message || 'Erreur inconnue')
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)

    let errorMessage = 'Erreur lors de l\'envoi de la réclamation'
    let errorCaption = 'Veuillez réessayer plus tard'

    if (error.response?.data?.errors) {
      // Erreurs de validation Laravel
      const errors = error.response.data.errors
      const firstError = Object.values(errors)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        errorMessage = firstError[0]
        errorCaption = 'Veuillez corriger les erreurs'
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      caption: errorCaption,
      position: 'top',
      timeout: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Styles personnalisés pour l'éditeur */
:deep(.q-editor) {
  border: 1px solid #e5e7eb;
}

:deep(.q-editor__content) {
  min-height: 250px;
}

/* Animation pour les fichiers */
.file-item {
  transition: all 0.3s ease;
}

.file-item:hover {
  transform: translateX(4px);
}
</style>
