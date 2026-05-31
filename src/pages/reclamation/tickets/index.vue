``<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="confirmation_number" size="2rem" class="text-blue-600 mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-1">Gestion des Tickets de Réclamation</h1>
              <p class="text-gray-600 text-sm">Gérez et consultez tous les tickets de réclamation</p>
            </div>
          </div>
          <q-btn
            color="blue-6"
            no-caps
            unelevated
            icon="add"
            v-if="privilege && privilege.insertion"
            class="px-6"
            @click="$router.push('/reclamations/ticket')"
          >
            Nouvelle réclamation
          </q-btn>
        </div>
      </div>

      <!-- Search & Filters Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Recherche textuelle -->
          <div class="md:col-span-1">
            <q-input
              v-model="searchQuery"
              placeholder="Rechercher dans l'objet ou description..."
              outlined
              dense
              clearable
              debounce="500"
              class="w-full"
            >
              <template v-slot:prepend>
                <q-icon name="search" class="text-gray-500" />
              </template>
            </q-input>
          </div>

          <!-- Filtre date début -->
          <div class="md:col-span-1">
            <q-input
              v-model="dateFrom"
              type="date"
              outlined
              dense
              label="Date début"
              class="w-full"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="text-gray-500" />
              </template>
            </q-input>
          </div>

          <!-- Filtre date fin -->
          <div class="md:col-span-1">
            <q-input
              v-model="dateTo"
              type="date"
              outlined
              dense
              label="Date fin"
              class="w-full"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="text-gray-500" />
              </template>
            </q-input>
          </div>
        </div>

        <!-- Filtres avancés -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Ticket de base (libellé actif) -->
          <div>
            <q-select
              v-model="selectedBaseTicketId"
              :options="baseTicketOptions"
              outlined
              dense
              label="Type de ticket (libellé)"
              class="w-full"
              emit-value
              map-options
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="assignment" class="text-gray-500" />
              </template>
            </q-select>
          </div>

          <!-- Statuts (multi-sélection) -->
          <div>
            <q-select
              v-model="selectedStatuses"
              :options="statusOptions"
              multiple
              use-chips
              outlined
              dense
              label="Statuts"
              class="w-full"
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="flag" class="text-gray-500" />
              </template>
            </q-select>
          </div>

          <!-- Priorité (multi-sélection) -->
          <div>
            <q-select
              v-model="selectedPriorites"
              :options="prioriteOptions"
              option-value="value"
              option-label="label"
              multiple
              use-chips
              outlined
              dense
              label="Priorité"
              class="w-full"
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="priority_high" class="text-gray-500" />
              </template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-badge :color="scope.opt.color" :label="scope.opt.label" />
                  </q-item-section>
                  <q-item-section>{{ scope.opt.label }}</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <!-- Bouton de réinitialisation des filtres -->
        <div class="flex justify-end mt-4" v-if="searchQuery || dateFrom || dateTo || selectedStatuses.length || selectedBaseTicketId || selectedPriorites.length">
          <q-btn
            @click="clearFilters"
            color="grey-6"
            outline
            no-caps
            icon="clear"
            size="sm"
          >
            Effacer les filtres
          </q-btn>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <q-spinner-dots size="3rem" color="blue-6" />
        <span class="ml-3 text-gray-600">Chargement des tickets...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="!tickets.length" class="text-center py-12">
        <q-icon name="confirmation_number" size="4rem" class="text-gray-300 mb-4" />
        <h3 class="text-xl font-medium text-gray-600 mb-2">Aucun ticket trouvé</h3>
        <p class="text-gray-500">{{ searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun ticket disponible' }}</p>
      </div>

      <!-- Tickets Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <q-card
          v-for="ticket in tickets"
          :key="ticket.id"
          class="bg-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <q-card-section class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ ticket.libelle || 'Ticket sans libellé' }}</h3>
                <p class="text-gray-600 text-sm mb-3" v-if="ticket.objet">
                  <q-icon name="subject" size="sm" class="mr-1" />
                  {{ ticket.objet }}
                </p>
                <!-- Affichage conditionnel du créateur -->
                <p class="text-blue-600 text-sm mb-2" v-if="ticket.createur">
                  <q-icon name="person" size="sm" class="mr-1" />
                  Créé par : {{ ticket.createur.nom_complet }}
                </p>
              </div>
              <div class="flex flex-col items-end space-y-1">
                <q-badge
                  :color="getStatusColor(ticket.status)"
                  :label="ticket.status || 'OUVERT'"
                  class="text-xs"
                />
                <q-badge
                  :color="getPrioriteColor(ticket.priorite)"
                  :label="getPrioriteLabel(ticket.priorite)"
                  class="text-xs"
                >
                  <q-icon name="flag" size="xs" class="mr-1" />
                  <q-tooltip>Priorité</q-tooltip>
                </q-badge>
                <!-- <q-badge
                  v-if="isTicketValidated(ticket)"
                  color="green"
                  label="VALIDÉ"
                  class="text-xs"
                >
                  <q-icon name="verified" size="xs" class="mr-1" />
                </q-badge> -->
              </div>
            </div>

            <!-- Dates de création et mise à jour -->
            <div class="bg-gray-50 rounded-lg p-3 mb-4" >
              <div v-if="ticket.created_at" class="text-xs text-gray-600 mb-1">
                <q-icon name="schedule" size="xs" class="mr-1" />
                Créé le {{ formatDate(ticket.created_at) }}
              </div>
              <div v-if="ticket.updated_at" class="text-xs text-yellow-500 mb-1">
                <q-icon name="update" size="xs" class="mr-1" />
                Mis à jour le {{ formatDate(ticket.updated_at) }}
              </div>

              <!-- Dates clés du cycle de traitement -->
              <div v-if="ticket.date_validation_createur" class="text-xs text-green-600 mb-1">
                <q-icon name="verified" size="xs" class="mr-1" />
                Validé le {{ formatDate(ticket.date_validation_createur) }}
              </div>
              <div v-if="ticket.date_en_cours" class="text-xs text-orange-600 mb-1">
                <q-icon name="play_arrow" size="xs" class="mr-1" />
                En cours depuis le {{ formatDate(ticket.date_en_cours) }}
              </div>
              <!-- Affichage conditionnel de closed_at selon la présence de recours :class="getClosedAtClass(ticket)"-->
              <div v-if="ticket.closed_at"  class="text-xs text-red-600 mb-1">
                <q-icon :name="getClosedAtIcon(ticket)" size="xs" class="mr-1" />
                {{ getClosedAtLabel(ticket) }} {{ formatDate(ticket.closed_at) }}
              </div>
              <div v-if="ticket.date_recours" class="text-xs text-blue-600 mb-1">
                <q-icon name="gavel" size="xs" class="mr-1" />
                Recours lancé le {{ formatDate(ticket.date_recours) }}
              </div>
              <div v-if="ticket.date_cloture_recours" class="text-xs text-black-600 mb-1">
                <q-icon name="cancel" size="xs" class="mr-1" />
                Clôture du recours le {{ formatDate(ticket.date_cloture_recours) }}
              </div>
            </div>

            <!-- Actions - Messages, Modifier et Supprimer -->
            <div class="flex justify-end space-x-2">
              <q-btn
                flat
                round
                color="blue-6"
                icon="chat"
                size="sm"
                v-if="ticket.status != 'ouvert'"
                @click.stop="viewMessages(ticket)"
              >
                <q-tooltip>Messages</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                :color="isTicketValidated(ticket) ? 'grey-4' : 'orange-6'"
                icon="edit"
                size="sm"
                :disable="isTicketValidated(ticket)"
                @click.stop="editTicket(ticket)"
              >
                <q-tooltip>{{ isTicketValidated(ticket) ? 'Ticket validé - Modification impossible' : 'Modifier' }}</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                :color="isTicketValidated(ticket) ? 'grey-4' : 'red-6'"
                icon="delete"
                size="sm"
                :disable="isTicketValidated(ticket)"
                @click.stop="deleteTicket(ticket)"
              >
                <q-tooltip>{{ isTicketValidated(ticket) ? 'Ticket validé - Suppression impossible' : 'Supprimer' }}</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && tickets.length" class="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Affichage de {{ (pagination.page - 1) * pagination.rowsPerPage + 1 }} à
            {{ Math.min(pagination.page * pagination.rowsPerPage, pagination.rowsNumber) }}
            sur {{ pagination.rowsNumber }} tickets
          </div>
          <q-pagination
            v-model="pagination.page"
            :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
            :max-pages="6"
            direction-links
            boundary-links
            color="blue-6"
            @update:model-value="onPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'
import { useTicketStore } from 'src/stores/ticket'
import { PRIORITE_OPTIONS, getPrioriteLabel, getPrioriteColor } from 'src/composables/usePriorite'

const $q = useQuasar()
const router = useRouter()
const ticketStore = useTicketStore()

// État réactif
const tickets = ref([])
const privilege = ref(null)
const isCommissionMember = ref(false)
const loading = ref(false)
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const selectedStatuses = ref([])
const statusOptions = ref([])
const baseTicketOptions = ref([])
const selectedBaseTicketId = ref(null)
const selectedPriorites = ref([])
const prioriteOptions = PRIORITE_OPTIONS

const pagination = reactive({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0
})

// Méthodes
const fetchTickets = async (props = {}) => {
  loading.value = true
  try {
    const { page = 1, rowsPerPage = 15 } = props.pagination || pagination

    const response = await api.get('/api/rec/tickets/indexAll', {
      params: {
        page,
        per_page: rowsPerPage,
        q: searchQuery.value,
        date_from: dateFrom.value,
        date_to: dateTo.value,
        statuses: selectedStatuses.value.join(','),
        bticket_id: selectedBaseTicketId.value,
        priorites: selectedPriorites.value.join(','),
        sort_by_priorite: true
      }
    })

    if (response.data.success) {
      privilege.value = response.data.data.privilege
      isCommissionMember.value = !!response.data.data.is_commission_member
      tickets.value = response.data.data.items
      statusOptions.value = (response.data.data.available_statuses || []).map(s => ({ label: s, value: s }))
      pagination.page = response.data.data.meta.current_page
      pagination.rowsPerPage = response.data.data.meta.per_page
      pagination.rowsNumber = response.data.data.meta.total
    }
  } catch (error) {
    console.error('Erreur lors du chargement des tickets:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement des tickets'
    })
  } finally {
    loading.value = false
  }
}

// Charger la liste des tickets de base actifs
const fetchBaseTickets = async () => {
  try {
    const resp = await api.get('/api/rec/tickets')
    // Cette API renvoie uniquement les tickets de base actifs (is_active = true)
    const items = Array.isArray(resp.data) ? resp.data : (resp.data?.data || [])
    baseTicketOptions.value = (items || []).map(t => ({ label: t.libelle || `Ticket ${t.id}`, value: t.id }))
  } catch (e) {
    console.error('Erreur lors du chargement des tickets de base:', e)
  }
}

const onPageChange = (newPage) => {
  pagination.page = newPage
  fetchTickets({ pagination })
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

const getStatusColor = (status) => {
  const statusColors = {
    'ouvert': 'blue',
    'En attente': 'grey',
    'En cours': 'orange',
    'clôturé': 'green',
    'Recours': 'orange',
    'Recours clôturé': 'green',

    // 'OUVERT': 'grey',
    // 'EN_COURS': 'orange',

    'FERME': 'green',
    'ANNULE': 'red',
    'Terminé': 'green',
    'Annulé': 'red'
  }
  return statusColors[status] || 'grey'
}

// Nouvelles méthodes pour l'affichage conditionnel de closed_at
const getClosedAtLabel = (ticket) => {
  return ticket.date_recours ? 'Refusé le' : 'Fermé le'
}

const getClosedAtIcon = (ticket) => {
  return ticket.date_recours ? 'block' : 'lock'
}

const getClosedAtClass = (ticket) => {
  // Rouge si pas de recours OU si recours clôturé
  const isRed = !ticket.date_recours || ticket.date_cloture_recours
  return isRed ? 'text-xs text-red-600' : 'text-xs text-gray-600'
}

const viewTicket = (ticket) => {
  router.push(`/reclamation/tickets/${ticket.id}`)
}

const editTicket = (ticket) => {
  // Rediriger vers edit2.vue avec l'ID du ticket
  router.push(`/reclamations/tickets/edit/${ticket.id}`)
}

const viewMessages = (ticket) => {
  // Enregistrer l'ID du ticket dans le store Pinia
  ticketStore.setTicketForMessages(ticket.id)
  // Naviguer vers la page des messages
  if (isCommissionMember.value && (ticket.status === 'Recours' || ticket.status === 'Recours clôturé')) {
    router.push('/reclamations/tickets/messages_recours')
  } else {
    router.push('/reclamations/tickets/messages')
  }
}

const deleteTicket = (ticket) => {
  $q.dialog({
    title: 'Confirmation de suppression',
    message: `Êtes-vous sûr de vouloir supprimer le ticket "${ticket.libelle || 'Ticket sans libellé'}" (ID: ${ticket.id}) ?\n\nCette action supprimera définitivement le ticket et toutes ses dépendances (types, détails, informations générales, fichiers, etc.).`,
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(async () => {
    try {
      loading.value = true
      const response = await api.delete(`/api/rec/tickets/${ticket.id}`)

      if (response.data.success) {
        $q.notify({
          type: 'positive',
          message: 'Ticket supprimé avec succès',
          position: 'top'
        })
        // Recharger la liste des tickets
        await fetchTickets({ pagination })
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du ticket:', error)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Erreur lors de la suppression du ticket',
        position: 'top'
      })
    } finally {
      loading.value = false
    }
  })
}

// Fonction pour effacer les filtres
const clearFilters = () => {
  searchQuery.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  selectedStatuses.value = []
  selectedBaseTicketId.value = null
  selectedPriorites.value = []
  pagination.page = 1
  fetchTickets({ pagination })
}

// Fonction pour vérifier si un ticket est validé
const isTicketValidated = (ticket) => {
  return ticket.is_creator_validated == 1 || ticket.is_creator_validated == true
}

// Watchers
watch(searchQuery, () => {
  pagination.page = 1
  fetchTickets({ pagination })
}, { debounce: 500 })

watch([dateFrom, dateTo], () => {
  pagination.page = 1
  fetchTickets({ pagination })
}, { debounce: 500 })

watch([selectedStatuses], () => {
  pagination.page = 1
  fetchTickets({ pagination })
}, { debounce: 400 })

watch(selectedBaseTicketId, () => {
  pagination.page = 1
  fetchTickets({ pagination })
}, { debounce: 300 })

watch([selectedPriorites], () => {
  pagination.page = 1
  fetchTickets({ pagination })
}, { debounce: 300 })

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchBaseTickets(),
    fetchTickets()
  ])
})
</script>

<style scoped>
/* Styles personnalisés pour le design moderne */
.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
