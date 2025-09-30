<template>
  <div class="q-pa-md">
    <!-- En-tête -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h5 class="text-h5 q-my-none">Messages du Ticket</h5>
        <p class="text-grey-6 q-mb-none" v-if="currentTicketId">
          Ticket ID: {{ currentTicketId }}
        </p>
        <p class="text-red q-mb-none" v-else>
          Aucun ticket sélectionné
        </p>
      </div>
      <div class="q-gutter-sm">
        <q-btn
          color="grey-6"
          icon="arrow_back"
          label="Retour"
          @click="goBack"
        />
        <q-btn
          color="primary"
          icon="add"
          label="Nouveau Message"
          @click="showNewMessageDialog = true"
          :disable="!currentTicketId"
        />
      </div>
    </div>

    <!-- Alerte si aucun ticket sélectionné -->
    <q-banner v-if="!currentTicketId" class="bg-red-1 text-red q-mb-md">
      <template v-slot:avatar>
        <q-icon name="warning" color="red" />
      </template>
      Aucun ticket sélectionné. Veuillez retourner à la liste des tickets et sélectionner un ticket.
      <template v-slot:action>
        <q-btn flat color="red" label="Retour aux tickets" @click="goBack" />
      </template>
    </q-banner>

    <!-- Liste des messages -->
    <div v-if="currentTicketId">
      <!-- Filtres -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md">
            <q-input
              v-model="searchQuery"
              outlined
              dense
              placeholder="Rechercher dans les messages..."
              class="col-md-4 col-sm-6 col-xs-12"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              outlined
              dense
              label="Statut"
              clearable
              class="col-md-3 col-sm-6 col-xs-12"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Messages -->
      <q-card v-if="loading" class="q-mb-md">
        <q-card-section>
          <div class="text-center">
            <q-spinner size="40px" color="primary" />
            <p class="q-mt-md">Chargement des messages...</p>
          </div>
        </q-card-section>
      </q-card>

      <div v-else-if="filteredMessages.length === 0" class="text-center q-pa-xl">
        <q-icon name="message" size="4rem" color="grey-4" />
        <p class="text-h6 text-grey-6 q-mt-md">Aucun message trouvé</p>
        <p class="text-grey-5">Commencez par envoyer le premier message</p>
      </div>

      <div v-else class="q-gutter-md">
        <q-card
          v-for="message in filteredMessages"
          :key="message.id"
          class="message-card cursor-pointer transition-all hover:shadow-lg"
          @click="viewMessageDetail(message)"
        >
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="col">
                <div class="text-h6 q-mb-xs">{{ message.subject }}</div>
                <div class="text-body2 text-grey-6 q-mb-sm">
                  <q-icon name="person" size="xs" class="q-mr-xs" />
                  {{ message.sender }}
                  <span class="q-mx-sm">•</span>
                  <q-icon name="schedule" size="xs" class="q-mr-xs" />
                  {{ formatDate(message.date) }}
                </div>
                <div class="text-body2 message-preview">
                  {{ truncateText(message.content, 150) }}
                </div>
              </div>
              <div class="col-auto q-ml-md">
                <q-chip
                  :color="message.isRead ? 'green' : 'orange'"
                  :text-color="message.isRead ? 'white' : 'black'"
                  size="sm"
                >
                  {{ message.isRead ? 'Lu' : 'Non lu' }}
                </q-chip>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center q-mt-lg" v-if="totalMessages > messagesPerPage">
        <q-pagination
          v-model="currentPage"
          :max="Math.ceil(totalMessages / messagesPerPage)"
          :max-pages="6"
          direction-links
          boundary-links
          color="primary"
        />
      </div>
    </div>

    <!-- Dialog Nouveau Message -->
    <q-dialog v-model="showNewMessageDialog" persistent>
      <q-card class="w-full" style="min-width: 80vw; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-blue-50">
          <q-icon name="message" class="text-blue-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-blue-900">Nouveau Message</div>
            <div class="text-sm text-blue-700">Créer un nouveau message pour le ticket {{ currentTicketId }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <q-form @submit="sendMessage" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <!-- Titre -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Titre <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="newMessage.subject"
                  outlined
                  dense
                  placeholder="Entrez le titre du message"
                  :rules="[val => !!val || 'Le titre est requis']"
                >
                  <template #prepend>
                    <q-icon name="title" class="text-blue-600" />
                  </template>
                </q-input>
              </div>

              <!-- Description avec QEditor -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Description <span class="text-red-500">*</span>
                </label>
                <q-editor
                  v-model="newMessage.content"
                  min-height="200px"
                  :toolbar="[
                    ['bold', 'italic', 'underline'],
                    ['unordered', 'ordered'],
                    ['undo', 'redo']
                  ]"
                  placeholder="Rédigez votre message..."
                />
              </div>

              <!-- Sélection multiple des directions -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Directions destinataires *
                </label>
                <q-select
                  v-model="newMessage.directions"
                  :options="directionOptions"
                  label="Sélectionnez une ou plusieurs directions"
                  multiple
                  outlined
                  use-chips
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  :loading="loadingDirections"
                  stack-label
                >
                  <template #prepend>
                    <q-icon name="business" class="text-blue-600" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Aucune direction disponible
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Upload de fichiers -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
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
                <div v-if="newMessage.attachments.length > 0" class="mt-3">
                  <div class="text-sm font-medium text-gray-700 mb-2">
                    Fichiers sélectionnés ({{ newMessage.attachments.length }}) :
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(file, index) in newMessage.attachments"
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
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn
            @click="closeNewMessageDialog"
            color="grey-6"
            outline
            no-caps
            class="px-6"
          >
            Annuler
          </q-btn>
          <q-btn
            @click="sendMessage"
            color="blue-6"
            no-caps
            unelevated
            class="px-6 ml-3"
            :loading="sending"
            :disable="!newMessage.subject || !newMessage.content"
          >
            Envoyer le message
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Détail Message -->
    <q-dialog v-model="showMessageDetail" persistent>
      <q-card style="min-width: 700px" v-if="selectedMessage">
        <q-card-section>
          <div class="text-h6">{{ selectedMessage.subject }}</div>
          <div class="text-body2 text-grey-6 q-mt-sm">
            <q-icon name="person" size="xs" class="q-mr-xs" />
            {{ selectedMessage.sender }}
            <span class="q-mx-sm">•</span>
            <q-icon name="schedule" size="xs" class="q-mr-xs" />
            {{ formatDate(selectedMessage.date) }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="message-content">
            {{ selectedMessage.content }}
          </div>
          
          <div v-if="selectedMessage.attachments && selectedMessage.attachments.length" class="q-mt-md">
            <div class="text-subtitle2 q-mb-sm">Pièces jointes :</div>
            <q-list>
              <q-item v-for="attachment in selectedMessage.attachments" :key="attachment.id">
                <q-item-section avatar>
                  <q-icon name="attach_file" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ attachment.name }}</q-item-label>
                  <q-item-label caption>{{ attachment.size }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round icon="download" @click="downloadAttachment(attachment)" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fermer" @click="closeMessageDetail" />
          <q-btn color="primary" label="Répondre" @click="replyToMessage" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useTicketStore } from 'src/stores/ticket'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const ticketStore = useTicketStore()

// État réactif
const loading = ref(false)
const messages = ref([])
const searchQuery = ref('')
const statusFilter = ref(null)
const currentPage = ref(1)
const messagesPerPage = 10
const showNewMessageDialog = ref(false)
const showMessageDetail = ref(false)
const selectedMessage = ref(null)
const sending = ref(false)

// Nouveau message
const newMessage = ref({
  subject: '',
  content: '',
  directions: [],
  attachments: []
})

// Upload
const newFiles = ref(null)
const loadingDirections = ref(false)
const directionOptions = ref([])

// Options
const statusOptions = [
  { label: 'Lu', value: true },
  { label: 'Non lu', value: false }
]

// Computed
const currentTicketId = computed(() => ticketStore.t_rec_ticket_id)

const filteredMessages = computed(() => {
  let filtered = messages.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(message => 
      message.subject.toLowerCase().includes(query) ||
      message.content.toLowerCase().includes(query) ||
      message.sender.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value !== null) {
    filtered = filtered.filter(message => message.isRead === statusFilter.value)
  }
  
  return filtered
})

const totalMessages = computed(() => filteredMessages.value.length)

// Méthodes
const goBack = () => {
  ticketStore.clearCurrentTicketId()
  router.push('/reclamation/tickets')
}

const loadMessages = async () => {
  if (!currentTicketId.value) return
  
  loading.value = true
  try {
    // Simulation de données pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    messages.value = [
      {
        id: 1,
        subject: 'Problème de connexion',
        content: 'Bonjour, je rencontre des difficultés pour me connecter à mon compte. Pouvez-vous m\'aider ?',
        sender: 'Client',
        date: new Date().toISOString(),
        isRead: false,
        attachments: []
      },
      {
        id: 2,
        subject: 'Réponse: Problème de connexion',
        content: 'Bonjour, nous avons bien reçu votre demande. Pouvez-vous nous préciser le navigateur que vous utilisez ?',
        sender: 'Support Technique',
        date: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
        attachments: []
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement des messages'
    })
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const viewMessageDetail = (message) => {
  selectedMessage.value = message
  showMessageDetail.value = true
  // Marquer comme lu
  if (!message.isRead) {
    message.isRead = true
  }
}

const closeMessageDetail = () => {
  showMessageDetail.value = false
  selectedMessage.value = null
}

const sendMessage = async () => {
  if (!newMessage.value.subject || !newMessage.value.content) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez remplir tous les champs obligatoires'
    })
    return
  }
  
  sending.value = true
  try {
    // Créer un FormData pour inclure les fichiers
     const formData = new FormData()
     formData.append('tticket_id', currentTicketId.value)
     formData.append('titre', newMessage.value.title)
     formData.append('description', newMessage.value.description)
     formData.append('directions', JSON.stringify(newMessage.value.directions))
    
    // Ajouter les fichiers au FormData
    newMessage.value.attachments.forEach((attachment, index) => {
      if (attachment.file) {
        formData.append(`attachments[${index}]`, attachment.file)
      }
    })

    const response = await api.post('/api/rec/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Message envoyé avec succès'
      })
      
      // Réinitialiser le formulaire
       newMessage.value = {
         title: '',
         description: '',
         directions: [],
         attachments: []
       }
       newFiles.value = null
       
       // Fermer le dialog
       showNewMessageDialog.value = false
       
       // Recharger les messages
       await loadMessages()
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi du message'
    $q.notify({
      type: 'negative',
      message: errorMessage
    })
  } finally {
    sending.value = false
  }
}

const closeNewMessageDialog = () => {
  showNewMessageDialog.value = false
  newMessage.value = {
    subject: '',
    content: '',
    directions: [],
    attachments: []
  }
  newFiles.value = null
}

const replyToMessage = () => {
  closeMessageDetail()
  newMessage.value.subject = `Re: ${selectedMessage.value.subject}`
  showNewMessageDialog.value = true
}

const downloadAttachment = (attachment) => {
  // Logique de téléchargement
  console.log('Téléchargement de:', attachment.name)
}

// Méthodes pour l'upload de fichiers
const onNewFilesSelected = (files) => {
  if (files && files.length > 0) {
    console.log('Nouveaux fichiers sélectionnés:', files)
  }
}

const addFiles = () => {
  if (newFiles.value && newFiles.value.length > 0) {
    const filesCount = newFiles.value.length
    
    newFiles.value.forEach(file => {
      // Vérifier si le fichier n'est pas déjà dans la liste
      const exists = newMessage.value.attachments.some(att => 
        att.name === file.name && att.size === file.size
      )
      
      if (!exists) {
        newMessage.value.attachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file // Garder une référence au fichier original
        })
      }
    })
    
    // Réinitialiser la sélection
    newFiles.value = null
    
    $q.notify({
      type: 'positive',
      message: `${filesCount} fichier(s) ajouté(s)`,
      position: 'top'
    })
  }
}

const removeFile = (index) => {
  newMessage.value.attachments.splice(index, 1)
  $q.notify({
    type: 'info',
    message: 'Fichier supprimé',
    position: 'top'
  })
}

const onRejected = (rejectedEntries) => {
  let message = 'Fichier(s) rejeté(s): '
  rejectedEntries.forEach(entry => {
    if (entry.failedPropValidation === 'max-file-size') {
      message += `${entry.file.name} (trop volumineux), `
    } else if (entry.failedPropValidation === 'accept') {
      message += `${entry.file.name} (format non supporté), `
    }
  })
  
  $q.notify({
    type: 'negative',
    message: message.slice(0, -2),
    position: 'top'
  })
}

const getFileIcon = (fileType) => {
  if (!fileType) return 'description'
  
  if (fileType.startsWith('image/')) {
    return 'image'
  } else if (fileType === 'application/pdf') {
    return 'picture_as_pdf'
  } else if (fileType.includes('word') || fileType.includes('document')) {
    return 'description'
  } else if (fileType.includes('text')) {
    return 'text_snippet'
  } else {
    return 'attach_file'
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Charger les directions disponibles
 const loadDirections = async () => {
   loadingDirections.value = true
   try {
     const response = await api.get('/api/rec/directions')
     
     if (response.data.success) {
       directionOptions.value = response.data.data.map(direction => ({
         label: direction.label,
         value: direction.value,
         id: direction.id
       }))
     } else {
       throw new Error(response.data.message || 'Erreur lors du chargement des directions')
     }
   } catch (error) {
     console.error('Erreur lors du chargement des directions:', error)
     $q.notify({
       type: 'negative',
       message: 'Erreur lors du chargement des directions'
     })
     
     // Fallback avec des directions par défaut en cas d'erreur
     directionOptions.value = [
       { label: 'Direction Générale', value: 'DG', id: 1 },
       { label: 'Direction Technique', value: 'DT', id: 2 },
       { label: 'Direction Commerciale', value: 'DC', id: 3 },
       { label: 'Direction des Ressources Humaines', value: 'DRH', id: 4 },
       { label: 'Direction Financière', value: 'DF', id: 5 }
     ]
   } finally {
     loadingDirections.value = false
   }
 }

// Watchers
watch(currentTicketId, (newId) => {
  if (newId) {
    loadMessages()
  }
})

// Lifecycle
onMounted(() => {
  if (currentTicketId.value) {
    loadMessages()
  }
  loadDirections()
})
</script>

<style scoped>
.message-card {
  border-left: 4px solid #1976d2;
}

.message-preview {
  line-height: 1.4;
  max-height: 2.8em;
  overflow: hidden;
}

.message-content {
  white-space: pre-wrap;
  line-height: 1.6;
}

.transition-all {
  transition: all 0.3s ease;
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>