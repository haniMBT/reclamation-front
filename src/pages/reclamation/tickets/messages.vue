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
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">Nouveau Message</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="sendMessage" class="q-gutter-md">
            <q-input
              v-model="newMessage.subject"
              label="Objet *"
              outlined
              :rules="[val => !!val || 'L\'objet est requis']"
            />
            
            <q-input
              v-model="newMessage.content"
              label="Message *"
              type="textarea"
              outlined
              rows="5"
              :rules="[val => !!val || 'Le message est requis']"
            />
            
            <q-select
              v-model="newMessage.recipients"
              :options="recipientOptions"
              label="Destinataires"
              multiple
              outlined
              use-chips
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" @click="closeNewMessageDialog" />
          <q-btn color="primary" label="Envoyer" @click="sendMessage" :loading="sending" />
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
  recipients: []
})

// Options
const statusOptions = [
  { label: 'Lu', value: true },
  { label: 'Non lu', value: false }
]

const recipientOptions = [
  { label: 'Support Technique', value: 'support' },
  { label: 'Service Client', value: 'client' },
  { label: 'Administration', value: 'admin' }
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
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Ajouter le message à la liste
    messages.value.unshift({
      id: Date.now(),
      subject: newMessage.value.subject,
      content: newMessage.value.content,
      sender: 'Vous',
      date: new Date().toISOString(),
      isRead: true,
      attachments: []
    })
    
    $q.notify({
      type: 'positive',
      message: 'Message envoyé avec succès'
    })
    
    closeNewMessageDialog()
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de l\'envoi du message'
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
    recipients: []
  }
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